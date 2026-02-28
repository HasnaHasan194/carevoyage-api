import type { Request, Response } from "express";

export interface IAdminController {
  getAllUsers(req: Request, res: Response): Promise<void>;
  blockUnblockUser(req: Request, res: Response): Promise<void>;
  getWalletTransactions(req: Request, res: Response): Promise<void>;
}

