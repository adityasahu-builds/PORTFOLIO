import { Router } from "express";
import { certificateController } from "./certificate.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../contact/contact.validation";
import { createCertificateSchema, updateCertificateSchema } from "./certificate.schema";

const router = Router();

// Public Routes
router.get("/", certificateController.getCertificates.bind(certificateController));
router.get("/:id", certificateController.getCertificate.bind(certificateController));

// Protected Admin Routes
router.post(
  "/",
  requireAuth,
  validate(createCertificateSchema),
  certificateController.createCertificate.bind(certificateController)
);
router.put(
  "/:id",
  requireAuth,
  validate(updateCertificateSchema),
  certificateController.updateCertificate.bind(certificateController)
);
router.delete(
  "/:id",
  requireAuth,
  certificateController.deleteCertificate.bind(certificateController)
);

// Bulk Operations
router.post(
  "/bulk-delete",
  requireAuth,
  certificateController.bulkDelete.bind(certificateController)
);
router.post(
  "/bulk-status",
  requireAuth,
  certificateController.bulkStatus.bind(certificateController)
);
router.post("/reorder", requireAuth, certificateController.reorder.bind(certificateController));

export default router;
