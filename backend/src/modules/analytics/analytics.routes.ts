import { Router } from "express";
import { analyticsController } from "./analytics.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

// Public ingestion route
router.post("/track", analyticsController.track.bind(analyticsController));

// Protected reporting routes
router.get("/dashboard", requireAuth, analyticsController.getDashboard.bind(analyticsController));
router.get("/visitors", requireAuth, analyticsController.getVisitors.bind(analyticsController));
router.get("/traffic", requireAuth, analyticsController.getTraffic.bind(analyticsController));
router.get("/content", requireAuth, analyticsController.getContent.bind(analyticsController));
router.get("/messages", requireAuth, analyticsController.getMessages.bind(analyticsController));

export default router;
