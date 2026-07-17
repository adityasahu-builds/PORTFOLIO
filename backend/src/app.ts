import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import { config } from "./config/env";
import { requestLogger } from "./middlewares/requestLogger.middleware";
import { apiLimiter } from "./middlewares/rateLimiter.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import apiRoutes from "./routes";

// Initialize express app
const app: Application = express();

// Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.disable("x-powered-by"); // Hide Express signature

// CORS Configuration
app.use(
  cors({
    origin: config.frontendUrl || "*", // Fallback to * if not set (for dev), but should be restricted in prod
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate Limiting (apply to all requests or specific routes)
app.use("/api", apiLimiter);

// Utility Middlewares
app.use(express.json({ limit: "10kb" })); // Parse JSON bodies, limit to 10kb
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(compression()); // Compress response bodies

// Logging Middleware
app.use(requestLogger);

// API Routes
app.use("/api/v1", apiRoutes);

// Handle 404 Not Found
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
