import { Router } from "express";
import { mediaController } from "./media.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "./upload.middleware";

const router = Router();

// Public routes
router.get("/", mediaController.getMedia);
router.get("/:id", mediaController.getMediaById);

// Admin-only routes
router.post("/upload", requireAuth, uploadMiddleware.single("file"), mediaController.uploadMedia);
router.delete("/:id", requireAuth, mediaController.deleteMedia);

export default router;
