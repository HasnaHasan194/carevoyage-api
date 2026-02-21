import { Request, Response } from "express";
import { CustomRequest } from "../../../middlewares/auth.middleware";

export interface IAgencySpecialNeedsController {
  enableSpecialNeed(req: CustomRequest, res: Response): Promise<void>;
  updateSpecialNeed(req: CustomRequest, res: Response): Promise<void>;
  toggleActiveStatus(req: CustomRequest, res: Response): Promise<void>;
  softDeleteSpecialNeed(req: CustomRequest, res: Response): Promise<void>;
  listAgencySpecialNeeds(req: CustomRequest, res: Response): Promise<void>;
}
