import type { Request, Response } from "express";

export interface ICaretakerDashboardController {
  getDashboard(req: Request, res: Response): Promise<void>;
  getTrips(req: Request, res: Response): Promise<void>;
}
