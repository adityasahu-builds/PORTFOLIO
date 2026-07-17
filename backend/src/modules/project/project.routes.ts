import { Router } from "express";
import { projectController } from "./project.controller";
import { validate } from "../contact/contact.validation"; // reuse Zod validation middleware
import { createProjectSchema, updateProjectSchema } from "./project.schema";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", projectController.getProjects.bind(projectController));
router.get("/:idOrSlug", projectController.getProject.bind(projectController));

// Protected routes (Admin Only)
router.post(
  "/",
  requireAuth,
  validate(createProjectSchema),
  projectController.createProject.bind(projectController)
);
router.put(
  "/:id",
  requireAuth,
  validate(updateProjectSchema),
  projectController.updateProject.bind(projectController)
);
router.delete("/:id", requireAuth, projectController.deleteProject.bind(projectController));

export default router;
