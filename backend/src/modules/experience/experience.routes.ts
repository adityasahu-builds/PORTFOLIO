import { Router } from "express";
import { experienceController } from "./experience.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../contact/contact.validation";
import { createExperienceSchema, updateExperienceSchema } from "./experience.schema";

const router = Router();

// Public Routes
router.get("/", experienceController.getExperiences);
router.get("/:id", experienceController.getExperience);

// Protected Admin Routes
router.post(
  "/",
  requireAuth,
  validate(createExperienceSchema),
  experienceController.createExperience
);
router.put(
  "/:id",
  requireAuth,
  validate(updateExperienceSchema),
  experienceController.updateExperience
);
router.delete("/:id", requireAuth, experienceController.deleteExperience);
router.post("/reorder", requireAuth, experienceController.reorder);

export default router;
