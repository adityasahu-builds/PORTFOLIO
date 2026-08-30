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

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, status: "error", message: "Current password and new password are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(authPayload.id);
    if (!user) {
      return NextResponse.json({ success: false, status: "error", message: "User not found" }, { status: 404 });
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return NextResponse.json(
        { success: false, status: "error", message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      status: "success",
      message: "Password changed successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, status: "error", message: err.message }, { status: 500 });
  }
}
