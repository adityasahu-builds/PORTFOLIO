import { NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";

export async function GET() {
  const db = await connectDB();
  return NextResponse.json({
    status: "success",
    message: "Portfolio API is healthy",
    database: db ? "connected" : "fallback_mode",
    timestamp: new Date().toISOString(),
  });
}
