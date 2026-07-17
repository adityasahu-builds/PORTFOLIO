import { Router } from "express";
import healthRoutes from "./health.routes";
import contactRoutes from "../modules/contact/contact.routes";
import authRoutes from "../modules/auth/auth.routes";
import projectRoutes from "../modules/project/project.routes";
import skillRoutes from "../modules/skill/skill.routes";
import experienceRoutes from "../modules/experience/experience.routes";
import educationRoutes from "../modules/education/education.routes";
import certificateRoutes from "../modules/certificate/certificate.routes";
import personalInfoRoutes from "../modules/personal-info/personal-info.routes";
import mediaRoutes from "../modules/media/media.routes";
import analyticsRoutes from "../modules/analytics/analytics.routes";

const router = Router();

// Version 1 API Routes
router.use("/health", healthRoutes);
router.use("/contact", contactRoutes);
router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/skills", skillRoutes);
router.use("/experience", experienceRoutes);
router.use("/education", educationRoutes);
router.use("/certificates", certificateRoutes);
router.use("/personal-info", personalInfoRoutes);
router.use("/media", mediaRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
