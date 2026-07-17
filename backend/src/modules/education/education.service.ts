import { Education, IEducation } from "./education.model";
import { CreateEducationInput, UpdateEducationInput } from "./education.schema";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export class EducationService {
  /**
   * Fetch all education records matching filters
   */
  public async getAllEducation(
    filters: { status?: "Active" | "Inactive"; featured?: boolean } = {}
  ): Promise<IEducation[]> {
    const query: any = {};
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }

    return Education.find(query).sort({ displayOrder: 1, startDate: -1 });
  }

  /**
   * Fetch a single education record by ID
   */
  public async getEducationById(id: string): Promise<IEducation> {
    const education = await Education.findById(id);
    if (!education) {
      throw new AppError("Education record not found.", 404);
    }
    return education;
  }

  /**
   * Create a new education record
   */
  public async createEducation(data: CreateEducationInput): Promise<IEducation> {
    const payload = { ...data };
    if (payload.currentlyStudying) {
      payload.endDate = undefined;
    }

    const education = new Education(payload);
    const savedEducation = await education.save();
    logger.info(
      `New education record created: ${savedEducation.degree} in ${savedEducation.fieldOfStudy} @ ${savedEducation.institutionName}`
    );

    return savedEducation;
  }

  /**
   * Update an existing education record
   */
  public async updateEducation(id: string, data: UpdateEducationInput): Promise<IEducation> {
    const education = await Education.findById(id);
    if (!education) {
      throw new AppError("Education record not found.", 404);
    }

    const payload = { ...data };
    if (payload.currentlyStudying) {
      payload.endDate = undefined;
    }

    Object.assign(education, payload);
    const updatedEducation = await education.save();
    logger.info(
      `Education updated: ${updatedEducation.degree} in ${updatedEducation.fieldOfStudy} @ ${updatedEducation.institutionName}`
    );

    return updatedEducation;
  }

  /**
   * Delete an education record
   */
  public async deleteEducation(id: string): Promise<void> {
    const result = await Education.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Education record not found.", 404);
    }
    logger.info(`Education deleted: ${result.degree} (ID: ${id})`);
  }

  /**
   * Update display order sequence (Drag & Drop)
   */
  public async updateOrder(orders: { id: string; displayOrder: number }[]): Promise<void> {
    const bulkOps = orders.map((o) => ({
      updateOne: {
        filter: { _id: o.id },
        update: { $set: { displayOrder: o.displayOrder } },
      },
    }));

    await Education.bulkWrite(bulkOps);
    logger.info(`Updated order sequence of ${orders.length} education records.`);
  }
}

export const educationService = new EducationService();
