import { Router } from "express";
import { personalInfoController } from "./personal-info.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../contact/contact.validation";
import { updatePersonalInfoSchema } from "./personal-info.schema";

const router = Router();

// Public route to fetch personal info
router.get("/", personalInfoController.getPersonalInfo);

// Protected route to update personal info (Admin Only)
router.put(
  "/",
  requireAuth,
  validate(updatePersonalInfoSchema),
  personalInfoController.updatePersonalInfo
);

export default router;
