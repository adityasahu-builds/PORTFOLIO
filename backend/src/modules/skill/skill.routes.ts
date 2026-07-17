import { Router } from "express";
import { skillController } from "./skill.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../contact/contact.validation";
import { createSkillSchema, updateSkillSchema } from "./skill.schema";

const router = Router();

// Public Routes
router.get("/", skillController.getSkills);
router.get("/:id", skillController.getSkill);

// Protected Admin Routes
router.post("/", requireAuth, validate(createSkillSchema), skillController.createSkill);
router.put("/:id", requireAuth, validate(updateSkillSchema), skillController.updateSkill);
router.delete("/:id", requireAuth, skillController.deleteSkill);

// Bulk and ordering routers
router.post("/bulk-delete", requireAuth, skillController.bulkDelete);
router.post("/bulk-status", requireAuth, skillController.bulkStatus);
router.post("/reorder", requireAuth, skillController.reorder);

export default router;
