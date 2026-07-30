import app from "./app";
import { config } from "./config/env";
import { logger } from "./utils/logger";
import { dbConnection } from "./database/connection";
import { Server } from "http";

const PORT = config.port;
let server: Server;

// Start Server
const startServer = async () => {
  try {
    // 1. Start Express Server First to bind TCP port immediately for Render
    server = app.listen(PORT, () => {
      logger.info(`Server is running in ${config.nodeEnv} mode on port ${PORT}`);
      logger.info(`Health check available at http://localhost:${PORT}/api/v1/health`);
    });

    // 2. Connect to Database asynchronously in background
    dbConnection.connect().catch((dbErr) => {
      logger.error("Initial database connection attempt encounter error", { error: dbErr });
    });
  } catch (error) {
    logger.error("Failed to start HTTP server", { error });
    process.exit(1);
  }
};

startServer();

// Handle Unhandled Rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...", {
    error: err.message,
    stack: err.stack,
  });
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle Uncaught Exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", { error: err.message, stack: err.stack });
  process.exit(1);
});

// Handle SIGTERM (Graceful Shutdown for Render/Docker)
process.on("SIGTERM", async () => {
  logger.info("SIGTERM RECEIVED. Shutting down gracefully...");
  if (server) {
    server.close(async () => {
      await dbConnection.disconnect();
      logger.info("Process terminated.");
    });
  } else {
    await dbConnection.disconnect();
    logger.info("Process terminated.");
  }
});
