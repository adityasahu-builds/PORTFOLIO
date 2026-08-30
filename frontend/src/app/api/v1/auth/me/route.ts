import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { User } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    if (!authPayload) {
      return NextResponse.json({ success: false, status: "error", message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(authPayload.id).lean();
    if (!user) {
      return NextResponse.json({ success: false, status: "error", message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
