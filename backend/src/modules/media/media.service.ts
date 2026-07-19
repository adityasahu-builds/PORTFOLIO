import { Media, IMedia } from "./media.model";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary.utility";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export class MediaService {
  /**
   * Upload a single media file
   */
  public async uploadMedia(
    file: Express.Multer.File,
    tags: string[] = [],
    folder = "portfolio"
  ): Promise<IMedia> {
    try {
      // 1. Determine resource type
      const isImage = file.mimetype.startsWith("image/");
      const resourceType = isImage ? "image" : "raw";

      // 2. Upload to Cloudinary using utility stream uploader
      const uploadResult = await uploadToCloudinary(file.buffer, folder, resourceType);

      // 3. Save details to MongoDB
      const media = new Media({
        originalName: file.originalname,
        publicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        size: file.size,
        mimeType: file.mimetype,
        folder,
        tags,
      });

      await media.save();
      logger.info(`Media uploaded and saved to DB: ${media.originalName}`);
      return media;
    } catch (error: any) {
      logger.error("Error in uploadMedia service:", { error: error.message });
      throw error;
    }
  }

  /**
   * Get all media files matching query and pagination settings
   */
  public async getAllMedia(options: {
    page: number;
    limit: number;
    search?: string;
    mimeTypeFilter?: string;
  }): Promise<{ media: IMedia[]; total: number; totalPages: number }> {
    const { page, limit, search, mimeTypeFilter } = options;
    const skip = (page - 1) * limit;

    const query: any = {};

    // Apply search filter (matching tags or originalName)
    if (search) {
      query.$or = [
        { originalName: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Apply mime type filter (e.g. "image" matches any "image/*")
    if (mimeTypeFilter) {
      if (mimeTypeFilter === "image") {
        query.mimeType = { $regex: /^image\// };
      } else if (mimeTypeFilter === "document") {
        query.mimeType = { $not: { $regex: /^image\// } };
      } else {
        query.mimeType = { $regex: mimeTypeFilter, $options: "i" };
      }
    }

    const total = await Media.countDocuments(query);
    const media = await Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return {
      media,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Fetch a single media record by ID
   */
  public async getMediaById(id: string): Promise<IMedia> {
    const media = await Media.findById(id);
    if (!media) {
      throw new AppError("Media file not found.", 404);
    }
    return media;
  }

  /**
   * Delete a single media record (DB + Cloudinary)
   */
  public async deleteMedia(id: string): Promise<void> {
    const media = await Media.findById(id);
    if (!media) {
      throw new AppError("Media file not found.", 404);
    }

    try {
      // 1. Attempt to delete from Cloudinary
      try {
        await deleteFromCloudinary(media.publicId);
      } catch (cloudinaryError: any) {
        logger.warn(`Cloudinary deletion failed for publicId ${media.publicId}: ${cloudinaryError.message}. Proceeding to delete from database.`);
      }

      // 2. Delete from database
      await Media.findByIdAndDelete(id);
      logger.info(`Media deleted from DB: ${media.publicId}`);
    } catch (error: any) {
      logger.error("Error in deleteMedia service:", { error: error.message });
      throw error;
    }
  }
}

export const mediaService = new MediaService();
