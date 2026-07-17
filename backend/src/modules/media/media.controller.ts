import { Request, Response, NextFunction } from "express";
import { mediaService } from "./media.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { AppError } from "../../errors/AppError";

export class MediaController {
  /**
   * Upload a single media asset
   */
  public async uploadMedia(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("No file provided for upload.", 400);
      }

      // Parse tags (comma separated or JSON array)
      let tags: string[] = [];
      if (req.body.tags) {
        try {
          tags =
            typeof req.body.tags === "string"
              ? req.body.tags.split(",").map((t: string) => t.trim())
              : req.body.tags;
        } catch (e) {
          tags = [];
        }
      }

      const folder = req.body.folder || "portfolio";

      const media = await mediaService.uploadMedia(req.file, tags, folder);

      const response = new ApiResponse(201, "File uploaded successfully.", media);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all media assets
   */
  public async getMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt((req.query.page as string) || "1", 10);
      const limit = parseInt((req.query.limit as string) || "12", 10);
      const search = (req.query.search as string) || "";
      const mimeTypeFilter = (req.query.mimeTypeFilter as string) || "";

      const result = await mediaService.getAllMedia({
        page,
        limit,
        search,
        mimeTypeFilter,
      });

      const response = new ApiResponse(200, "Media files retrieved successfully.", result);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get media asset by ID
   */
  public async getMediaById(req: Request, res: Response, next: NextFunction) {
    try {
      const media = await mediaService.getMediaById(req.params.id);
      const response = new ApiResponse(200, "Media details retrieved successfully.", media);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a media asset by ID
   */
  public async deleteMedia(req: Request, res: Response, next: NextFunction) {
    try {
      await mediaService.deleteMedia(req.params.id);
      const response = new ApiResponse(200, "Media file deleted successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();
