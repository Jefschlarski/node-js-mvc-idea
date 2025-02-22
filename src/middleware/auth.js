import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Op } from "sequelize";

const publicPaths = [
  "/login",
  "/health",
  "/register",
  "/assets",
  "/css",
  "/js",
  "/icons"
];

export const authMiddleware = async (req, res, next) => {
  const isPublicPath = publicPaths.some((path) => req.path.startsWith(path));

  if (isPublicPath) {
    return next();
  }

  const token = req.cookies.jwt || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    logger.info(`Acesso não autorizado à rota ${req.path}`);
    req.flash("message", "Por favor, faça login para continuar");
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    next();
  } catch (error) {
    logger.error("Token inválido:", error);
    res.clearCookie("jwt");
    req.flash("message", "Sessão expirada, faça login novamente");
    return res.redirect("/login");
  }
};

export const checkAuth = (req, res, next) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect("/login");
  }
  next();
};

export const checkPermission = (req, res, next) => {
  const userType = req.session.userType;
  if (userType != "admin" && userType != "root") {
    return res.redirect("/");
  }
  next();
};

export const hashPassword = (password, salt) => {
  if (!salt) {
    salt = bcrypt.genSaltSync(10);
  }
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

export const checkPassword = (password, hashedPassword) => {
  const passwordMatch = bcrypt.compareSync(password, hashedPassword);
  return passwordMatch;
};
