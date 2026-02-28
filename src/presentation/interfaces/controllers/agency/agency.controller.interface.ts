import { Request, Response } from "express";

export interface IAgencyController {
  inviteCaretaker(req: Request, res: Response): Promise<void>;
  listCaretakers(req: Request, res: Response): Promise<void>;
  updateCaretakerAvailability(req: Request, res: Response): Promise<void>;
  softDeleteCaretaker(req: Request, res: Response): Promise<void>;
  updateCaretakerPrice(req: Request, res: Response): Promise<void>;
  listCaretakerRequests(req: Request, res: Response): Promise<void>;
  fulfillCaretakerRequest(req: Request, res: Response): Promise<void>;
  listRefundRequests(req: Request, res: Response): Promise<void>;
  approveRefundRequest(req: Request, res: Response): Promise<void>;
  rejectRefundRequest(req: Request, res: Response): Promise<void>;
  getBookingDetail(req: Request, res: Response): Promise<void>;
}



