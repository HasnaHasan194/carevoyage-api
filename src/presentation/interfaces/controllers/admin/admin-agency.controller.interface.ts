import { Request, Response } from "express";

export interface IAdminAgencyController {
  getAgencies(req: Request, res: Response): Promise<void>;
  getAgencyDetails(req: Request, res: Response): Promise<void>;
  blockAgency(req: Request, res: Response): Promise<void>;
  unblockAgency(req: Request, res: Response): Promise<void>;
  verifyAgency(req: Request, res: Response): Promise<void>;
  rejectAgency(req: Request, res: Response): Promise<void>;
}





