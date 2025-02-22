import express from "express";
const router = express.Router();

import AuthController from "../controllers/AuthController.js";
import { checkAuth } from "../helpers/auth.js";

router.get("/login", AuthController.loginView);
router.post("/login", AuthController.login);
router.get("/register", AuthController.registerView);
router.post("/register", AuthController.register);
router.get("/logout", checkAuth, AuthController.logout);

export default router;
