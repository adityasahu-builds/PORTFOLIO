import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "../contact/contact.validation"; // reuse Zod validator middleware
import { loginSchema } from "./auth.validation";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/login", validate(loginSchema), authController.login.bind(authController));
router.post("/refresh", authController.refresh.bind(authController));

// Protected routes
router.post("/logout", requireAuth, authController.logout.bind(authController));
router.get("/me", requireAuth, authController.me.bind(authController));
router.put("/profile", requireAuth, authController.updateProfile.bind(authController));
router.put("/change-password", requireAuth, authController.changePassword.bind(authController));

export default router;
