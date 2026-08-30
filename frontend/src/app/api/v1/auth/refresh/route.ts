import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { User } from "@/server/models";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/server/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const refreshToken =
      req.cookies.get("refreshToken")?.value ||
      (await req.json().catch(() => ({}))).refreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, status: "error", message: "No refresh token provided" },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { success: false, status: "error", message: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { success: false, status: "error", message: "Session expired, please login again" },
        { status: 401 }
      );
    }

    const newAccessToken = signAccessToken({ id: user._id.toString(), role: user.role });
    const newRefreshToken = signRefreshToken({ id: user._id.toString(), role: user.role });

    user.refreshToken = newRefreshToken;
    await user.save();

    const response = NextResponse.json({
      success: true,
      status: "success",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
