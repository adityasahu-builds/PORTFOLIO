import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/server/db/connection";
import { Contact } from "@/server/models";
import { extractAuthUser } from "@/server/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const messages = await Contact.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ status: "success", data: messages });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, subject, message } = body;

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        { status: "error", message: "All fields (fullName, email, subject, message) are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const contact = await Contact.create({ fullName, email, subject, message });

    // Optional Brevo email delivery in background
    const brevoApiKey = process.env.BREVO_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "aditya261226@gmail.com";
    const senderEmail = process.env.EMAIL_FROM?.includes("@") 
      ? process.env.EMAIL_FROM.replace(/.*<([^>]+)>.*/, "$1").trim() 
      : "mefake2620122@gmail.com";

    if (brevoApiKey) {
      fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Aditya Portfolio", email: senderEmail },
          to: [{ email: receiverEmail }],
          replyTo: { email: email, name: fullName },
          subject: `[Portfolio Contact] ${subject} - from ${fullName}`,
          htmlContent: `
            <h2>New Contact Message Received</h2>
            <p><strong>From:</strong> ${fullName} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background:#f4f4f5;padding:12px;border-left:4px solid #3b82f6;">${message}</blockquote>
          `,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          console.error("Brevo API Error:", res.status, errText);
        } else {
          console.log("Email sent via Brevo successfully!");
        }
      }).catch((emailErr) => {
        console.error("Brevo email send error:", emailErr.message);
      });
    }

    return NextResponse.json(
      { status: "success", data: contact, message: "Thank you! Your message has been sent successfully." },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/v1/contact error:", err.message);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
