import { Experience, IExperience } from "./experience.model";
import { CreateExperienceInput, UpdateExperienceInput } from "./experience.schema";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export class ExperienceService {
  /**
   * Fetch all experiences matching optional filters
   */
  public async getAllExperiences(
    filters: { status?: "Active" | "Inactive"; featured?: boolean } = {}
  ): Promise<IExperience[]> {
    const query: any = {};
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }

    return Experience.find(query).sort({ displayOrder: 1, startDate: -1 });
  }

  /**
   * Fetch a single experience by ID
   */
  public async getExperienceById(id: string): Promise<IExperience> {
    const experience = await Experience.findById(id);
    if (!experience) {
      throw new AppError("Experience not found.", 404);
    }
    return experience;
  }

  /**
   * Create a new experience record
   */
  public async createExperience(data: CreateExperienceInput): Promise<IExperience> {
    const payload = { ...data };
    if (payload.currentlyWorking) {
      payload.endDate = undefined;
    }

    const experience = new Experience(payload);
    const savedExperience = await experience.save();
    logger.info(
      `New experience record created: ${savedExperience.role} @ ${savedExperience.companyName}`
    );

    return savedExperience;
  }

  /**
   * Update an existing experience record
   */
  public async updateExperience(id: string, data: UpdateExperienceInput): Promise<IExperience> {
    const experience = await Experience.findById(id);
    if (!experience) {
      throw new AppError("Experience not found.", 404);
    }

    const payload = { ...data };
    if (payload.currentlyWorking) {
      payload.endDate = undefined;
    }

    Object.assign(experience, payload);
    const updatedExperience = await experience.save();
    logger.info(`Experience updated: ${updatedExperience.role} @ ${updatedExperience.companyName}`);

    return updatedExperience;
  }

  /**
   * Delete an experience record
   */
  public async deleteExperience(id: string): Promise<void> {
    const result = await Experience.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Experience not found.", 404);
    }
    logger.info(`Experience deleted: ${result.role} @ ${result.companyName} (ID: ${id})`);
  }

  /**
   * Drag and drop order updating
   */
  public async updateOrder(orders: { id: string; displayOrder: number }[]): Promise<void> {
    const bulkOps = orders.map((o) => ({
      updateOne: {
        filter: { _id: o.id },
        update: { $set: { displayOrder: o.displayOrder } },
      },
    }));

    await Experience.bulkWrite(bulkOps);
    logger.info(`Updated order sequence of ${orders.length} experiences.`);
  }
}

export const experienceService = new ExperienceService();
