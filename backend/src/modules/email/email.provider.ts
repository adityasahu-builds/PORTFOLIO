import nodemailer from "nodemailer";
import { config } from "../../config/env";
import { logger } from "../../utils/logger";
import { EmailOptions } from "./email.types";

class EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465, // true for 465, false for other ports
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
      connectionTimeout: 5000, // 5 seconds
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info("SMTP connection established successfully.");
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to establish SMTP connection", { error: errMessage });
      // We log but do NOT crash the server, as email should not break core functionality
    }
  }

  public async sendMail(options: EmailOptions): Promise<boolean> {
    try {
      logger.info(
        `Queuing email to ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`
      );

      const mailOptions = {
        from: config.smtp.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to send email", { error: errMessage, subject: options.subject });
      return false;
    }
  }
}

// Export a singleton instance
export const emailProvider = new EmailProvider();
