import { Request, Response } from "express";
import { CustomRequest } from "../../../middlewares/auth.middleware";

export interface IAgencySpecialNeedsMasterController {
  createSpecialNeed(req: CustomRequest, res: Response): Promise<void>;
  updateSpecialNeed(req: CustomRequest, res: Response): Promise<void>;
  deleteSpecialNeed(req: CustomRequest, res: Response): Promise<void>;
  getSpecialNeeds(req: CustomRequest, res: Response): Promise<void>;
  getActiveSpecialNeeds(req: CustomRequest, res: Response): Promise<void>;
}
