import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { User } from "@/server/models";
import { signAccessToken, signRefreshToken } from "@/server/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const { usernameOrEmail, password } = await req.json();

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { success: false, status: "error", message: "Username/Email and Password are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail.toLowerCase().trim() },
        { email: usernameOrEmail.toLowerCase().trim() },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, status: "error", message: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, status: "error", message: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    const payload = { id: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    const userData = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    const response = NextResponse.json({
      success: true,
      status: "success",
      message: "Login successful",
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });

    // Set HTTP-only secure cookie for refresh token
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("POST /api/v1/auth/login error:", err.message);
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
