import { config } from "../../config/env";
import { logger } from "../../utils/logger";
import { EmailOptions } from "./email.types";

function parseEmailFrom(fromStr: string): { name: string; email: string } {
  const match = fromStr.match(/^(?:"?([^"]*)"?\s)?<?([^>]+)>?$/);
  if (match) {
    return {
      name: match[1]?.trim() || "Sender",
      email: match[2]?.trim() || fromStr
    };
  }
  return { name: "Sender", email: fromStr };
}

class EmailProvider {
  private apiKey: string;
  private fromName: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = config.brevoApiKey;
    const parsedFrom = parseEmailFrom(config.emailFrom);
    this.fromName = parsedFrom.name;
    this.fromEmail = parsedFrom.email;

    if (!this.apiKey) {
      logger.warn("BREVO_API_KEY is not defined. Email sending will run in MOCK mode.");
    } else {
      logger.info("Brevo API Email Provider initialized.");
    }
  }

  public async sendMail(options: EmailOptions): Promise<boolean> {
    const toEmails = Array.isArray(options.to) ? options.to : [options.to];
    logger.info(`Queuing email via Brevo API to ${toEmails.join(", ")}`);

    if (!this.apiKey) {
      logger.info("[Mock Send Email] - Brevo API key missing. Email details:", {
        to: toEmails,
        subject: options.subject,
        html: options.html ? "(HTML Content present)" : "(No HTML)",
      });
      return true;
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": this.apiKey,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: {
            name: this.fromName,
            email: this.fromEmail
          },
          to: toEmails.map(email => ({ email })),
          subject: options.subject,
          htmlContent: options.html,
          textContent: options.text || undefined,
          replyTo: options.replyTo ? { email: options.replyTo } : undefined
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brevo API responded with status ${response.status}: ${errorText}`);
      }

      const responseData: any = await response.json();
      logger.info(`Email sent successfully via Brevo: ${responseData.messageId}`);
      return true;
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to send email via Brevo API", { error: errMessage, subject: options.subject });
      return false;
    }
  }
}

// Export a singleton instance
export const emailProvider = new EmailProvider();
