import { Skill, ISkill } from "./skill.model";
import { CreateSkillInput, UpdateSkillInput } from "./skill.schema";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export class SkillService {
  /**
   * Fetch all skills matching optional filters
   */
  public async getAllSkills(
    filters: { category?: string; status?: "Active" | "Inactive"; featured?: boolean } = {}
  ): Promise<ISkill[]> {
    const query: any = {};
    if (filters.category) {
      query.category = { $regex: new RegExp(`^${filters.category}$`, "i") };
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }

    return Skill.find(query).sort({ displayOrder: 1, createdAt: -1 });
  }

  /**
   * Fetch a single skill by ID
   */
  public async getSkillById(id: string): Promise<ISkill> {
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new AppError("Skill not found.", 404);
    }
    return skill;
  }

  /**
   * Create a new skill node
   */
  public async createSkill(data: CreateSkillInput): Promise<ISkill> {
    const slugLower = data.slug.toLowerCase();

    // Check duplicate slug
    const existingSlug = await Skill.findOne({ slug: slugLower });
    if (existingSlug) {
      throw new AppError("Duplicate slug error. This skill identifier is already in use.", 400);
    }

    const skill = new Skill({
      ...data,
      slug: slugLower,
    });

    const savedSkill = await skill.save();
    logger.info(`New skill created: ${savedSkill.title} (Slug: ${savedSkill.slug})`);

    return savedSkill;
  }

  /**
   * Update an existing skill node
   */
  public async updateSkill(id: string, data: UpdateSkillInput): Promise<ISkill> {
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new AppError("Skill not found.", 404);
    }

    // Verify slug uniqueness if changed
    if (data.slug && data.slug.toLowerCase() !== skill.slug) {
      const slugLower = data.slug.toLowerCase();
      const existingSlug = await Skill.findOne({ slug: slugLower, _id: { $ne: id } });
      if (existingSlug) {
        throw new AppError("Duplicate slug error. This skill identifier is already in use.", 400);
      }
      data.slug = slugLower;
    }

    // Assign properties
    Object.assign(skill, data);

    const updatedSkill = await skill.save();
    logger.info(`Skill updated: ${updatedSkill.title} (Slug: ${updatedSkill.slug})`);

    return updatedSkill;
  }

  /**
   * Delete a skill node
   */
  public async deleteSkill(id: string): Promise<void> {
    const result = await Skill.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Skill not found.", 404);
    }
    logger.info(`Skill deleted: ${result.title} (ID: ${id})`);
  }

  /**
   * Bulk delete skills
   */
  public async bulkDelete(ids: string[]): Promise<void> {
    await Skill.deleteMany({ _id: { $in: ids } });
    logger.info(`Bulk deleted ${ids.length} skills.`);
  }

  /**
   * Bulk status change
   */
  public async bulkUpdateStatus(ids: string[], status: "Active" | "Inactive"): Promise<void> {
    await Skill.updateMany({ _id: { $in: ids } }, { $set: { status } });
    logger.info(`Bulk updated status of ${ids.length} skills to ${status}.`);
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

    await Skill.bulkWrite(bulkOps);
    logger.info(`Updated order sequence of ${orders.length} skills.`);
  }
}

export const skillService = new SkillService();
