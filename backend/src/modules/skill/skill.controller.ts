import { Request, Response, NextFunction } from "express";
import { skillService } from "./skill.service";
import { CreateSkillInput, UpdateSkillInput } from "./skill.schema";
import { ApiResponse } from "../../utils/ApiResponse";

export class SkillController {
  /**
   * Fetch all skills
   */
  public async getSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, status, featured } = req.query;

      const filters: any = {};
      if (category) filters.category = String(category);
      if (status) filters.status = status as "Active" | "Inactive";
      if (featured !== undefined) filters.featured = featured === "true";

      const skills = await skillService.getAllSkills(filters);

      const response = new ApiResponse(200, "Skills retrieved successfully.", skills);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch a single skill by ID
   */
  public async getSkill(req: Request, res: Response, next: NextFunction) {
    try {
      const skill = await skillService.getSkillById(req.params.id);
      const response = new ApiResponse(200, "Skill retrieved successfully.", skill);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new skill node (Admin Only)
   */
  public async createSkill(
    req: Request<unknown, unknown, CreateSkillInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const skill = await skillService.createSkill(req.body);
      const response = new ApiResponse(201, "Skill created successfully.", skill);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing skill (Admin Only)
   */
  public async updateSkill(
    req: Request<{ id: string }, unknown, UpdateSkillInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const skill = await skillService.updateSkill(req.params.id, req.body);
      const response = new ApiResponse(200, "Skill updated successfully.", skill);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a single skill (Admin Only)
   */
  public async deleteSkill(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await skillService.deleteSkill(req.params.id);
      const response = new ApiResponse(200, "Skill deleted successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk delete skills (Admin Only)
   */
  public async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      await skillService.bulkDelete(ids);
      const response = new ApiResponse(200, "Skills deleted successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk change statuses (Admin Only)
   */
  public async bulkStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, status } = req.body;
      await skillService.bulkUpdateStatus(ids, status);
      const response = new ApiResponse(200, `Status updated to ${status} successfully.`, null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder drag & drop sequence (Admin Only)
   */
  public async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orders } = req.body; // orders is an array of { id, displayOrder }
      await skillService.updateOrder(orders);
      const response = new ApiResponse(200, "Skills reordered successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const skillController = new SkillController();
