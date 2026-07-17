import { Router } from "express";
import { contactController } from "./contact.controller";
import { validate } from "./contact.validation";
import { createContactSchema } from "./contact.schema";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

// Public Routes
router.post(
  "/",
  validate(createContactSchema),
  contactController.submitContact.bind(contactController)
);

// Protected Admin Routes
router.get("/", requireAuth, contactController.getContacts.bind(contactController));
router.delete("/:id", requireAuth, contactController.deleteContact.bind(contactController));

export default router;
