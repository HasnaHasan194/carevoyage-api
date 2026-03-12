import type { Request, Response } from "express";

export interface IReviewController {
  createAgencyReview(req: Request, res: Response): Promise<void>;
  listAgencyReviews(req: Request, res: Response): Promise<void>;
}

