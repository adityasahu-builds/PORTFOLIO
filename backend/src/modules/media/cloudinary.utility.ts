import { v2 as cloudinary } from "cloudinary";
import { config } from "../../config/env";
import { logger } from "../../utils/logger";

// Configure Cloudinary only if credentials are present
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  logger.info("Cloudinary utility configured successfully.");
} else {
  logger.warn("Cloudinary credentials are not configured. Running in mock/offline media mode.");
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: string;
}

/**
 * Uploads a file buffer directly to Cloudinary using streams
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder = "portfolio",
  resourceType: "auto" | "image" | "raw" = "auto"
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
      // Return a simulated mock response for local testing and offline execution
      logger.info("Simulating mock Cloudinary upload...");
      const mockId = `mock_${Date.now()}`;
      return resolve({
        public_id: `${folder}/${mockId}`,
        secure_url: `https://res.cloudinary.com/demo/image/upload/v1234567890/${folder}/${mockId}.png`,
        width: 800,
        height: 600,
        format: "png",
        resource_type: "image",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          logger.error("Cloudinary upload stream error:", { error: error.message });
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload returned empty result"));
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes a file from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    logger.info(`Simulating mock Cloudinary delete for: ${publicId}`);
    return { result: "ok" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error: any) {
    logger.error("Cloudinary delete error:", { error: error.message });
    throw error;
  }
};
