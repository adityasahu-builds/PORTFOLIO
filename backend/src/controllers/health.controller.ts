import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const checkHealth = asyncHandler(async (req: Request, res: Response) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting", "uninitialized"];
  const dbStateIndex = mongoose.connection.readyState;
  const dbStatus = dbStates[dbStateIndex] || "unknown";

  const healthData = {
    serverStatus: "ok",
    databaseStatus: dbStatus,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  const response = new ApiResponse(200, "Server is healthy", healthData);
  res.status(200).json(response);
});
