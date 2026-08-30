import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { User } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    if (authPayload) {
      await connectDB();
      const user = await User.findById(authPayload.id);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    const response = NextResponse.json({
      success: true,
      status: "success",
      message: "Logged out successfully",
    });

    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
