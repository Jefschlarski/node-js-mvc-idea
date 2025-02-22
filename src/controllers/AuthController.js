import bcrypt from "bcryptjs";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import { generateToken } from "../middleware/token.js";
import { checkPassword } from "../helpers/auth.js";

class AuthController {
  static async loginView(req, res) {
    res.render("auth/login");
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user || !checkPassword(password, user.password)) {
        req.flash("message", "Credenciais inválidas");
        return res.redirect("/login");
      }

      const { token, csrfToken } = await generateToken(user);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hora
      });

      req.session.userId = user.id;
      req.session.userType = user.type;

      req.flash("message", "Autenticação realizada com sucesso!");
      res.redirect("/");
    } catch (error) {
      logger.error("Erro no login:", error);
      req.flash("message", "Erro ao realizar login");
      res.redirect("/login");
    }
  }

  static async registerView(req, res) {
    res.render("auth/register");
  }

  static async register(req, res) {
    const { name, email, password, confirmPassword } = req.body;
    if (password != confirmPassword) {
      req.flash("message", "Passwords not match, please try again!");
      res.render("auth/register", {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      return;
    }
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      req.flash("message", "Email already exists, please try again!");
      res.render("auth/register", {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
      let user = await User.create({ name, email, password: hashedPassword });

      req.session.userId = user.id;
      req.session.userType = user.type;
      req.flash("message", "User created successfully! ");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      logger.error("Erro no registro:", { error: error.message, email });
      console.log(error);
    }
  }

  static async logout(req, res) {
    try {
      if (req.user?.id) {
        await User.update(
          {
            token: null,
            tokenExpiresAt: null,
            csrfToken: null,
            csrfTokenExpiresAt: null,
          },
          {
            where: { id: req.user.id },
          },
        );
      }

      res.clearCookie("jwt");
      res.clearCookie("XSRF-TOKEN");
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      logger.error("Erro no logout:", error);
      res.redirect("/");
    }
  }
}

export default AuthController;
