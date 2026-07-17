import { Request, Response, NextFunction } from "express";
import { educationService } from "./education.service";
import { CreateEducationInput, UpdateEducationInput } from "./education.schema";
import { ApiResponse } from "../../utils/ApiResponse";

export class EducationController {
  /**
   * Fetch all education records
   */
  public async getEducations(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, featured } = req.query;

      const filters: any = {};
      if (status) filters.status = status as "Active" | "Inactive";
      if (featured !== undefined) filters.featured = featured === "true";

      const educations = await educationService.getAllEducation(filters);

      const response = new ApiResponse(
        200,
        "Education records retrieved successfully.",
        educations
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch a single education record by ID
   */
  public async getEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const education = await educationService.getEducationById(req.params.id);
      const response = new ApiResponse(200, "Education record retrieved successfully.", education);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new education record (Admin Only)
   */
  public async createEducation(
    req: Request<unknown, unknown, CreateEducationInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const education = await educationService.createEducation(req.body);
      const response = new ApiResponse(201, "Education record created successfully.", education);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing education record (Admin Only)
   */
  public async updateEducation(
    req: Request<{ id: string }, unknown, UpdateEducationInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const education = await educationService.updateEducation(req.params.id, req.body);
      const response = new ApiResponse(200, "Education record updated successfully.", education);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a single education record (Admin Only)
   */
  public async deleteEducation(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await educationService.deleteEducation(req.params.id);
      const response = new ApiResponse(200, "Education record deleted successfully.", null);
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
      const { orders } = req.body;
      await educationService.updateOrder(orders);
      const response = new ApiResponse(200, "Education records reordered successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const educationController = new EducationController();
