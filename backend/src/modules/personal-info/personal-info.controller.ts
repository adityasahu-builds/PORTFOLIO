import { Request, Response, NextFunction } from "express";
import { personalInfoService } from "./personal-info.service";
import { UpdatePersonalInfoInput } from "./personal-info.schema";
import { ApiResponse } from "../../utils/ApiResponse";

export class PersonalInfoController {
  /**
   * Fetch personal information (Public)
   */
  public async getPersonalInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const personalInfo = await personalInfoService.getPersonalInfo();
      const response = new ApiResponse(
        200,
        "Personal information retrieved successfully.",
        personalInfo
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update personal information (Admin Only)
   */
  public async updatePersonalInfo(
    req: Request<unknown, unknown, UpdatePersonalInfoInput>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const personalInfo = await personalInfoService.updatePersonalInfo(req.body);
      const response = new ApiResponse(
        200,
        "Personal information updated successfully.",
        personalInfo
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const personalInfoController = new PersonalInfoController();
