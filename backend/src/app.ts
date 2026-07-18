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
const allowedOrigins = [
  config.frontendUrl,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) => {
        return (
          origin === allowed ||
          origin.replace(/^https?:\/\//, "") === allowed.replace(/^https?:\/\//, "")
        );
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
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
