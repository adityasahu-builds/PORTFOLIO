import { Request, Response, NextFunction } from "express";
import { contactService } from "./contact.service";
import { CreateContactInput } from "./contact.schema";
import { ApiResponse } from "../../utils/ApiResponse";
import { emailService } from "../email/email.service";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export class ContactController {
  public async submitContact(
    req: Request<unknown, unknown, CreateContactInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      // 1. Save to MongoDB First
      const savedContact = await contactService.createContact(req.body);

      // 2. Return HTTP Response Immediately to user to ensure fast UX
      const response = new ApiResponse(201, "Message sent successfully.", {
        id: savedContact._id,
        createdAt: savedContact.createdAt,
      });
      res.status(201).json(response);

      // 3. Dispatch emails asynchronously & concurrently in background
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      Promise.allSettled([
        emailService.sendContactNotification({
          fullName: savedContact.fullName,
          email: savedContact.email,
          subject: savedContact.subject,
          message: savedContact.message,
          ipAddress,
          userAgent,
        }),
        emailService.sendAutoReply({
          fullName: savedContact.fullName,
          email: savedContact.email,
        }),
      ]).then((results) => {
        results.forEach((res, index) => {
          const type = index === 0 ? "Notification Email" : "Auto-Reply Email";
          if (res.status === "fulfilled") {
            logger.info(`${type} dispatched successfully for contact ${savedContact._id}`);
          } else {
            logger.error(`Failed to send ${type} for contact ${savedContact._id}`, {
              error: res.reason?.message || res.reason,
            });
          }
        });
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all contact submissions (Admin Only)
   */
  public async getContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(String(req.query.page || "1"), 10);
      const limit = parseInt(String(req.query.limit || "20"), 10);
      const search = req.query.search ? String(req.query.search) : undefined;

      const result = await contactService.getContacts({ page, limit, search });

      const response = new ApiResponse(200, "Messages retrieved successfully.", {
        data: result.contacts,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: result.pages,
        },
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a single contact message (Admin Only)
   */
  public async deleteContact(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await contactService.deleteContact(req.params.id);
      const response = new ApiResponse(200, "Message deleted successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const contactController = new ContactController();
