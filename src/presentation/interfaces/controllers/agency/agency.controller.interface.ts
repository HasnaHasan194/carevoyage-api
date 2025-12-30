import { Request, Response } from "express";

export interface IAgencyController {
  inviteCaretaker(req: Request, res: Response): Promise<void>;
}




