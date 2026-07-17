import { Request, Response, NextFunction } from "express";
import { experienceService } from "./experience.service";
import { CreateExperienceInput, UpdateExperienceInput } from "./experience.schema";
import { ApiResponse } from "../../utils/ApiResponse";

export class ExperienceController {
  /**
   * Fetch all experiences
   */
  public async getExperiences(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, featured } = req.query;

      const filters: any = {};
      if (status) filters.status = status as "Active" | "Inactive";
      if (featured !== undefined) filters.featured = featured === "true";

      const experiences = await experienceService.getAllExperiences(filters);

      const response = new ApiResponse(200, "Experiences retrieved successfully.", experiences);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch a single experience by ID
   */
  public async getExperience(req: Request, res: Response, next: NextFunction) {
    try {
      const experience = await experienceService.getExperienceById(req.params.id);
      const response = new ApiResponse(200, "Experience retrieved successfully.", experience);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new experience (Admin Only)
   */
  public async createExperience(
    req: Request<unknown, unknown, CreateExperienceInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const experience = await experienceService.createExperience(req.body);
      const response = new ApiResponse(201, "Experience created successfully.", experience);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing experience (Admin Only)
   */
  public async updateExperience(
    req: Request<{ id: string }, unknown, UpdateExperienceInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const experience = await experienceService.updateExperience(req.params.id, req.body);
      const response = new ApiResponse(200, "Experience updated successfully.", experience);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a single experience (Admin Only)
   */
  public async deleteExperience(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await experienceService.deleteExperience(req.params.id);
      const response = new ApiResponse(200, "Experience deleted successfully.", null);
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
      await experienceService.updateOrder(orders);
      const response = new ApiResponse(200, "Experiences reordered successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const experienceController = new ExperienceController();
