import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { User } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function PUT(req: NextRequest) {
  try {
    const authPayload = extractAuthUser(req);
    if (!authPayload) {
      return NextResponse.json({ success: false, status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const { username, email } = await req.json();
    await connectDB();

    const user = await User.findById(authPayload.id);
    if (!user) {
      return NextResponse.json({ success: false, status: "error", message: "User not found" }, { status: 404 });
    }

    if (username) user.username = username.toLowerCase().trim();
    if (email) user.email = email.toLowerCase().trim();

    await user.save();

    return NextResponse.json({
      success: true,
      status: "success",
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      message: "Profile updated successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
