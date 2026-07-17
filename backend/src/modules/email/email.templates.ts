import sanitizeHtml from "sanitize-html";
import { ContactNotificationOptions, AutoReplyOptions } from "./email.types";

const sanitize = (text: string) => sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });

export const getContactNotificationTemplate = (data: ContactNotificationOptions): string => {
  const safeName = sanitize(data.fullName);
  const safeEmail = sanitize(data.email);
  const safeSubject = sanitize(data.subject);
  const safeMessage = sanitize(data.message).replace(/\n/g, "<br>");
  const safeIp = sanitize(data.ipAddress || "Unknown");
  const safeUserAgent = sanitize(data.userAgent || "Unknown");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        .header { background: #f8f9fa; padding: 15px; border-bottom: 2px solid #007bff; border-radius: 8px 8px 0 0; }
        .content { padding: 20px 0; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; }
        .message-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; font-style: italic; }
        .footer { margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field"><span class="label">Name:</span> ${safeName}</div>
          <div class="field"><span class="label">Email:</span> <a href="mailto:${safeEmail}">${safeEmail}</a></div>
          <div class="field"><span class="label">Subject:</span> ${safeSubject}</div>
          <div class="field"><span class="label">Message:</span></div>
          <div class="message-box">${safeMessage}</div>
        </div>
        <div class="footer">
          <p><strong>Submission Metadata:</strong></p>
          <p>Time: ${new Date().toISOString()}</p>
          <p>IP Address: ${safeIp}</p>
          <p>User Agent: ${safeUserAgent}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getAutoReplyTemplate = (data: AutoReplyOptions): string => {
  const safeName = sanitize(data.fullName);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #2c3e50; margin: 0; }
        .content { color: #444; }
        .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Reaching Out!</h1>
        </div>
        <div class="content">
          <p>Hi ${safeName},</p>
          <p>Thank you for getting in touch. I have received your message and will review it shortly.</p>
          <p>I typically respond within <strong>24-48 hours</strong>.</p>
          <p>In the meantime, feel free to browse more of my work on my portfolio.</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p><strong>Aditya Sahu</strong></p>
          <p>This is an automated response. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
