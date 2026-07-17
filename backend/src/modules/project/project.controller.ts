import { Request, Response, NextFunction } from "express";
import { projectService } from "./project.service";
import { CreateProjectInput, UpdateProjectInput } from "./project.schema";
import { ApiResponse } from "../../utils/ApiResponse";
import mongoose from "mongoose";

export class ProjectController {
  /**
   * Get all project documents
   */
  public async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, featured } = req.query;

      const filters: any = {};
      if (category) {
        filters.category = String(category);
      }
      if (featured !== undefined) {
        filters.featured = featured === "true";
      }

      const projects = await projectService.getAllProjects(filters);

      const response = new ApiResponse(200, "Projects retrieved successfully.", projects);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single project by ID or Slug
   */
  public async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { idOrSlug } = req.params;

      let project;
      if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        project = await projectService.getProjectById(idOrSlug);
      } else {
        project = await projectService.getProjectBySlug(idOrSlug);
      }

      const response = new ApiResponse(200, "Project retrieved successfully.", project);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new project (Admin Only)
   */
  public async createProject(
    req: Request<unknown, unknown, CreateProjectInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const project = await projectService.createProject(req.body);

      const response = new ApiResponse(201, "Project created successfully.", project);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing project (Admin Only)
   */
  public async updateProject(
    req: Request<{ id: string }, unknown, UpdateProjectInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const project = await projectService.updateProject(req.params.id, req.body);

      const response = new ApiResponse(200, "Project updated successfully.", project);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a project document (Admin Only)
   */
  public async deleteProject(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await projectService.deleteProject(req.params.id);

      const response = new ApiResponse(200, "Project deleted successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
