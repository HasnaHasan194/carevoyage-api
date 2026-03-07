import type { Request, Response } from "express";

export interface IAgencySalesReportController {
  getSalesReport(req: Request, res: Response): Promise<void>;
  getSalesReportPdf(req: Request, res: Response): Promise<void>;
  getSalesReportExcel(req: Request, res: Response): Promise<void>;
}
