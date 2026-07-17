import { Router } from "express";
import { educationController } from "./education.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../contact/contact.validation";
import { createEducationSchema, updateEducationSchema } from "./education.schema";

const router = Router();

// Public Routes
router.get("/", educationController.getEducations);
router.get("/:id", educationController.getEducation);

// Protected Admin Routes
router.post("/", requireAuth, validate(createEducationSchema), educationController.createEducation);
router.put(
  "/:id",
  requireAuth,
  validate(updateEducationSchema),
  educationController.updateEducation
);
router.delete("/:id", requireAuth, educationController.deleteEducation);
router.post("/reorder", requireAuth, educationController.reorder);

export default router;
