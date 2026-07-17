import { Contact, IContact } from "./contact.model";
import { CreateContactInput } from "./contact.schema";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export class ContactService {
  /**
   * Create a new contact submission
   */
  public async createContact(data: CreateContactInput): Promise<IContact> {
    try {
      const contact = new Contact({
        fullName: data.fullName,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      const savedContact = await contact.save();
      logger.info(`New contact submission from ${savedContact.email}`, {
        contactId: savedContact._id,
      });

      return savedContact;
    } catch (error) {
      logger.error("Failed to save contact submission to database", { error });
      throw new AppError("Failed to process your request. Please try again later.", 500);
    }
  }

  /**
   * Get all contact submissions with pagination and search
   */
  public async getContacts(options: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ contacts: IContact[]; total: number; pages: number }> {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const [contacts, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(query),
    ]);

    return { contacts, total, pages: Math.ceil(total / limit) };
  }

  /**
   * Get total count of messages
   */
  public async getTotalCount(): Promise<number> {
    return Contact.countDocuments();
  }

  /**
   * Delete a contact submission by ID
   */
  public async deleteContact(id: string): Promise<void> {
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Message not found.", 404);
    }
    logger.info(`Contact message deleted: ${id}`);
  }
}

export const contactService = new ContactService();
