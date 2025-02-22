import jwt from "jsonwebtoken";
import crypto from "crypto";
import logger from "../utils/logger.js";
import User from "../models/User.js";
import { Op } from "sequelize";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TOKEN_EXPIRATION = "1h";
const TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 hora em milissegundos
const CSRF_EXPIRATION = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

// Rotas que não precisam de CSRF
const csrfExcludedPaths = ["/login", "/register"];

export const generateToken = async (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, type: user.type },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION },
  );

  const csrfToken = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const tokenExpiresAt = new Date(now.getTime() + TOKEN_EXPIRATION_MS);
  const csrfTokenExpiresAt = new Date(now.getTime() + CSRF_EXPIRATION);

  // Salvar tokens no banco
  await User.update(
    {
      token,
      tokenExpiresAt,
      csrfToken,
      csrfTokenExpiresAt,
    },
    {
      where: { id: user.id },
    },
  );

  return { token, csrfToken };
};

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      where: {
        id: decoded.id,
        token,
        tokenExpiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      throw new Error("Token inválido ou expirado");
    }

    req.user = decoded;
    res.locals.user = {
      id: user.id,
      type: user.type,
      isAuthenticated: true,
    };
    next();
  } catch (error) {
    logger.error("Token inválido:", error);
    res.clearCookie("jwt");
    res.locals.user = null;
    next();
  }
};

// CSRF Protection
export const csrfProtection = async (req, res, next) => {
  // Ignora CSRF para rotas específicas
  if (csrfExcludedPaths.includes(req.path)) {
    return next();
  }

  if (req.method === "GET") {
    const user = await User.findByPk(req.user?.id);
    if (!user) {
      return next();
    }

    // Gerar novo token CSRF se não existir ou estiver expirado
    if (!user.csrfToken || new Date() > user.csrfTokenExpiresAt) {
      const csrfToken = crypto.randomBytes(32).toString("hex");
      const csrfTokenExpiresAt = new Date(Date.now() + CSRF_EXPIRATION);

      await user.update({ csrfToken, csrfTokenExpiresAt });
      res.locals.csrfToken = csrfToken;
      res.cookie("XSRF-TOKEN", csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } else {
      res.locals.csrfToken = user.csrfToken;
      res.cookie("XSRF-TOKEN", user.csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
    next();
  } else {
    const user = await User.findByPk(req.user?.id);
    if (!user) {
      return res.status(403).json({ error: "Usuário não encontrado" });
    }

    const token = req.cookies["XSRF-TOKEN"];
    const headerToken = req.headers["x-csrf-token"] || req.body._csrf;

    if (
      !token ||
      !headerToken ||
      token !== headerToken ||
      token !== user.csrfToken
    ) {
      logger.warn("CSRF token inválido", {
        path: req.path,
        method: req.method,
        expectedToken: user.csrfToken,
        receivedToken: headerToken,
      });
      return res.status(403).json({ error: "Invalid CSRF token" });
    }

    if (new Date() > user.csrfTokenExpiresAt) {
      return res.status(403).json({ error: "CSRF token expirado" });
    }

    next();
  }
};
