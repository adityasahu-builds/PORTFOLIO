import { Request, Response, NextFunction } from "express";
import { certificateService } from "./certificate.service";
import { CreateCertificateInput, UpdateCertificateInput } from "./certificate.schema";
import { ApiResponse } from "../../utils/ApiResponse";

export class CertificateController {
  /**
   * Fetch all certificates
   */
  public async getCertificates(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, featured, search } = req.query;

      const filters: any = {};
      if (status) filters.status = status as "Active" | "Inactive";
      if (featured !== undefined) filters.featured = featured === "true";
      if (search) filters.search = String(search);

      const certificates = await certificateService.getAllCertificates(filters);
      const response = new ApiResponse(200, "Certificates retrieved successfully.", certificates);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch a single certificate by ID
   */
  public async getCertificate(req: Request, res: Response, next: NextFunction) {
    try {
      const certificate = await certificateService.getCertificateById(req.params.id);
      const response = new ApiResponse(200, "Certificate retrieved successfully.", certificate);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new certificate (Admin Only)
   */
  public async createCertificate(
    req: Request<unknown, unknown, CreateCertificateInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const certificate = await certificateService.createCertificate(req.body);
      const response = new ApiResponse(201, "Certificate created successfully.", certificate);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing certificate (Admin Only)
   */
  public async updateCertificate(
    req: Request<{ id: string }, unknown, UpdateCertificateInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const certificate = await certificateService.updateCertificate(req.params.id, req.body);
      const response = new ApiResponse(200, "Certificate updated successfully.", certificate);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a certificate (Admin Only)
   */
  public async deleteCertificate(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await certificateService.deleteCertificate(req.params.id);
      const response = new ApiResponse(200, "Certificate deleted successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk delete certificates (Admin Only)
   */
  public async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      await certificateService.bulkDelete(ids);
      const response = new ApiResponse(200, "Certificates deleted successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk status update (Admin Only)
   */
  public async bulkStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, status } = req.body;
      await certificateService.bulkUpdateStatus(ids, status);
      const response = new ApiResponse(200, `Status updated to ${status} successfully.`, null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reorder certificates (Admin Only)
   */
  public async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orders } = req.body;
      await certificateService.updateOrder(orders);
      const response = new ApiResponse(200, "Certificates reordered successfully.", null);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const certificateController = new CertificateController();
