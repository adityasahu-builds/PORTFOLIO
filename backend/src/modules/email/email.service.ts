import { config } from "../../config/env";
import { logger } from "../../utils/logger";
import { emailProvider } from "./email.provider";
import { EMAIL_SUBJECTS } from "./email.constants";
import { getContactNotificationTemplate, getAutoReplyTemplate } from "./email.templates";
import { ContactNotificationOptions, AutoReplyOptions } from "./email.types";

export class EmailService {
  /**
   * Sends an internal notification to the website owner about a new contact form submission.
   */
  public async sendContactNotification(data: ContactNotificationOptions): Promise<void> {
    try {
      const htmlContent = getContactNotificationTemplate(data);
      const recipient = config.contactReceiverEmail || data.email;

      const success = await emailProvider.sendMail({
        to: recipient,
        subject: EMAIL_SUBJECTS.NEW_CONTACT_SUBMISSION,
        html: htmlContent,
        replyTo: data.email, // Allows the owner to hit "Reply" and send directly to the user
      });
      if (!success) {
        throw new Error("Failed to deliver notification mail through Brevo provider.");
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("Error in EmailService.sendContactNotification", { error: errMessage });
      throw new Error(`Notification Error: ${errMessage}`);
    }
  }

  /**
   * Sends an automated thank you / acknowledgment email to the user who submitted the form.
   */
  public async sendAutoReply(data: AutoReplyOptions): Promise<void> {
    try {
      const htmlContent = getAutoReplyTemplate(data);

      const success = await emailProvider.sendMail({
        to: data.email,
        subject: EMAIL_SUBJECTS.CONTACT_AUTO_REPLY,
        html: htmlContent,
      });
      if (!success) {
        throw new Error("Failed to deliver auto-reply mail through Brevo provider.");
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("Error in EmailService.sendAutoReply", { error: errMessage });
      throw new Error(`AutoReply Error: ${errMessage}`);
    }
  }
}

export const emailService = new EmailService();
