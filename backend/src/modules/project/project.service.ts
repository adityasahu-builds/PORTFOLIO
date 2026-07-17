import { Project, IProject } from "./project.model";
import { CreateProjectInput, UpdateProjectInput } from "./project.schema";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export class ProjectService {
  /**
   * Fetch all projects matching optional filter categories
   */
  public async getAllProjects(
    filters: { category?: string; featured?: boolean } = {}
  ): Promise<IProject[]> {
    const query: any = {};
    if (filters.category) {
      query.category = { $regex: new RegExp(`^${filters.category}$`, "i") };
    }
    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }

    return Project.find(query).sort({ displayOrder: 1, createdAt: -1 });
  }

  /**
   * Fetch a single project by ID
   */
  public async getProjectById(id: string): Promise<IProject> {
    const project = await Project.findById(id);
    if (!project) {
      throw new AppError("Project not found.", 404);
    }
    return project;
  }

  /**
   * Fetch a single project by Slug
   */
  public async getProjectBySlug(slug: string): Promise<IProject> {
    const project = await Project.findOne({ slug: slug.toLowerCase() });
    if (!project) {
      throw new AppError("Project not found.", 404);
    }
    return project;
  }

  /**
   * Create a new project document
   */
  public async createProject(data: CreateProjectInput): Promise<IProject> {
    const slugLower = data.slug.toLowerCase();

    // Check duplicate slug
    const existingSlug = await Project.findOne({ slug: slugLower });
    if (existingSlug) {
      throw new AppError(
        "Duplicate slug error. This project URL identifier is already in use.",
        400
      );
    }

    const project = new Project({
      ...data,
      slug: slugLower,
    });

    const savedProject = await project.save();
    logger.info(`New project created: ${savedProject.title} (Slug: ${savedProject.slug})`);

    return savedProject;
  }

  /**
   * Update an existing project
   */
  public async updateProject(id: string, data: UpdateProjectInput): Promise<IProject> {
    const project = await Project.findById(id);
    if (!project) {
      throw new AppError("Project not found.", 404);
    }

    // Verify slug uniqueness if changed
    if (data.slug && data.slug.toLowerCase() !== project.slug) {
      const slugLower = data.slug.toLowerCase();
      const existingSlug = await Project.findOne({ slug: slugLower, _id: { $ne: id } });
      if (existingSlug) {
        throw new AppError(
          "Duplicate slug error. This project URL identifier is already in use.",
          400
        );
      }
      data.slug = slugLower;
    }

    // Assign properties
    Object.assign(project, data);

    const updatedProject = await project.save();
    logger.info(`Project updated: ${updatedProject.title} (Slug: ${updatedProject.slug})`);

    return updatedProject;
  }

  /**
   * Delete a project from database
   */
  public async deleteProject(id: string): Promise<void> {
    const result = await Project.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Project not found.", 404);
    }
    logger.info(`Project deleted: ${result.title} (ID: ${id})`);
  }
}

export const projectService = new ProjectService();
