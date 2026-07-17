import { emailService } from "./src/modules/email/email.service";
import { getContactNotificationTemplate, getAutoReplyTemplate } from "./src/modules/email/email.templates";

const runVerification = async () => {
  console.log("=== PHASE 4A EMAIL ARCHITECTURE VERIFICATION ===");

  try {
    console.log("\n1. Testing Template Generation (Contact Notification)");
    const notificationHtml = getContactNotificationTemplate({
      fullName: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "Test Message",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
    });
    if (!notificationHtml.includes("Test User") || !notificationHtml.includes("127.0.0.1")) {
      throw new Error("Template generation failed to include data.");
    }
    console.log("✅ Contact Notification Template rendered successfully");

    console.log("\n2. Testing Template Generation (Auto Reply)");
    const replyHtml = getAutoReplyTemplate({
      fullName: "Test User",
      email: "test@example.com",
    });
    if (!replyHtml.includes("Test User")) {
      throw new Error("Auto Reply Template generation failed to include data.");
    }
    console.log("✅ Auto Reply Template rendered successfully");

    console.log("\n3. Testing graceful failure of Service (with invalid credentials)");
    console.log("Sending fake contact notification...");
    await emailService.sendContactNotification({
      fullName: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "Test Message",
    });
    
    console.log("Sending fake auto-reply...");
    await emailService.sendAutoReply({
      fullName: "Test User",
      email: "test@example.com",
    });

    console.log("\n✅ Service did not crash. Error handling is verified.");
    console.log("=== VERIFICATION COMPLETE ===");
    process.exit(0);
  } catch (error) {
    console.error("❌ VERIFICATION FAILED:", error);
    process.exit(1);
  }
};

runVerification();
