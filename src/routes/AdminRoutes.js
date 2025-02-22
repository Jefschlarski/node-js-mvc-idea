import express from "express";
import AdminController from "../controllers/AdminController.js";
import { checkAuth, checkPermission } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin", checkAuth, checkPermission, AdminController.adminView);
router.get(
  "/admin/idea",
  checkAuth,
  checkPermission,
  AdminController.ideasView,
);
router.get(
  "/admin/user",
  checkAuth,
  checkPermission,
  AdminController.usersView,
);

export default router;
