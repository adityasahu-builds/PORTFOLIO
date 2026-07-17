import { Certificate, ICertificate } from "./certificate.model";
import { CreateCertificateInput, UpdateCertificateInput } from "./certificate.schema";
import { AppError } from "../../errors/AppError";
import { logger } from "../../utils/logger";

export class CertificateService {
  /**
   * Fetch all certificates matching optional filters
   */
  public async getAllCertificates(
    filters: {
      status?: "Active" | "Inactive";
      featured?: boolean;
      search?: string;
    } = {}
  ): Promise<ICertificate[]> {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.featured !== undefined) query.featured = filters.featured;
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { issuer: { $regex: filters.search, $options: "i" } },
      ];
    }

    return Certificate.find(query).sort({ displayOrder: 1, createdAt: -1 });
  }

  /**
   * Get total count of certificates
   */
  public async getTotalCount(): Promise<number> {
    return Certificate.countDocuments();
  }

  /**
   * Fetch a single certificate by ID
   */
  public async getCertificateById(id: string): Promise<ICertificate> {
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      throw new AppError("Certificate not found.", 404);
    }
    return certificate;
  }

  /**
   * Create a new certificate
   */
  public async createCertificate(data: CreateCertificateInput): Promise<ICertificate> {
    const certificate = new Certificate(data);
    const saved = await certificate.save();
    logger.info(`New certificate created: ${saved.title} (${saved.issuer})`);
    return saved;
  }

  /**
   * Update an existing certificate
   */
  public async updateCertificate(id: string, data: UpdateCertificateInput): Promise<ICertificate> {
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      throw new AppError("Certificate not found.", 404);
    }

    Object.assign(certificate, data);
    const updated = await certificate.save();
    logger.info(`Certificate updated: ${updated.title}`);
    return updated;
  }

  /**
   * Delete a certificate
   */
  public async deleteCertificate(id: string): Promise<void> {
    const result = await Certificate.findByIdAndDelete(id);
    if (!result) {
      throw new AppError("Certificate not found.", 404);
    }
    logger.info(`Certificate deleted: ${result.title} (ID: ${id})`);
  }

  /**
   * Bulk delete certificates
   */
  public async bulkDelete(ids: string[]): Promise<void> {
    await Certificate.deleteMany({ _id: { $in: ids } });
    logger.info(`Bulk deleted ${ids.length} certificates.`);
  }

  /**
   * Bulk status change
   */
  public async bulkUpdateStatus(ids: string[], status: "Active" | "Inactive"): Promise<void> {
    await Certificate.updateMany({ _id: { $in: ids } }, { $set: { status } });
    logger.info(`Bulk updated status of ${ids.length} certificates to ${status}.`);
  }

  /**
   * Update display order
   */
  public async updateOrder(orders: { id: string; displayOrder: number }[]): Promise<void> {
    const bulkOps = orders.map((o) => ({
      updateOne: {
        filter: { _id: o.id },
        update: { $set: { displayOrder: o.displayOrder } },
      },
    }));
    await Certificate.bulkWrite(bulkOps);
    logger.info(`Updated order of ${orders.length} certificates.`);
  }
}

export const certificateService = new CertificateService();
