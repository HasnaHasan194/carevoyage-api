import { Request, Response } from "express";

export interface IAgencyPackageController {
  createPackage(req: Request, res: Response): Promise<void>;
  updatePackage(req: Request, res: Response): Promise<void>;
  publishPackage(req: Request, res: Response): Promise<void>;
  getPackages(req: Request, res: Response): Promise<void>;
  getPackageById(req: Request, res: Response): Promise<void>;
  getPackageBookings(req: Request, res: Response): Promise<void>;
  updatePackageBasic(req: Request, res: Response): Promise<void>;
  updatePackageImages(req: Request, res: Response): Promise<void>;
  updatePackageItinerary(req: Request, res: Response): Promise<void>;
  deletePackage(req: Request, res: Response): Promise<void>;
  completePackage(req: Request, res: Response): Promise<void>;
  cancelPackage(req: Request, res: Response): Promise<void>;
}

