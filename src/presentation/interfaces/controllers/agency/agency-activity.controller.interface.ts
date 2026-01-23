import { Request, Response } from "express";

export interface IAgencyActivityController {
  createActivity(req: Request, res: Response): Promise<void>;
  getAllActivities(req: Request, res: Response): Promise<void>;
}


