import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import type { IGetAllUsersUsecase } from "../../../application/usecase/interfaces/admin/getallusers.interface";
import type { IBlockUnblockUserUsecase } from "../../../application/usecase/interfaces/admin/blockUnblock.interface";
import type { IListWalletTransactionsUseCase } from "../../../application/usecase/interfaces/admin/list-wallet-transactions.interface";
import type { IGetAdminSalesReportUseCase } from "../../../application/usecase/interfaces/sales-report/get-admin-sales-report.interface";
import type { IExportSalesReportUseCase } from "../../../application/usecase/interfaces/sales-report/export-sales-report.interface";
import type { IAdminController } from "../../interfaces/controllers/admin/admin.controller.interface";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import { toExportPayload } from "../../../application/mapper/sales-report.mapper";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject("IGetAllUsersUsecase")
    private _getAllUsersUsecase: IGetAllUsersUsecase,

    @inject("IBlockUnblockUserUsecase")
    private _blockUnblockUserUsecase: IBlockUnblockUserUsecase,

    @inject("IListWalletTransactionsUseCase")
    private _listWalletTransactionsUseCase: IListWalletTransactionsUseCase,

    @inject("IGetAdminSalesReportUseCase")
    private _getAdminSalesReportUseCase: IGetAdminSalesReportUseCase,

    @inject("IExportSalesReportUseCase")
    private _exportSalesReportUseCase: IExportSalesReportUseCase
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await this._getAllUsersUsecase.execute(page, limit);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }

  async blockUnblockUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { isBlocked } = req.body as { isBlocked: boolean };

    await this._blockUnblockUserUsecase.execute(userId, isBlocked);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGE.USER.STATUS_UPDATED,
    });
  }

  async getWalletTransactions(req: Request, res: Response): Promise<void> {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const rawType = req.query.type as string | undefined;
    const rawSource = req.query.source as string | undefined;
    const rawSort = req.query.sort as string | undefined;

    const type: "CREDIT" | "DEBIT" | undefined =
      rawType === "CREDIT" || rawType === "DEBIT" ? rawType : undefined;
    const source: "PAYMENT" | "REFUND" | "COMMISSION" | undefined =
      rawSource === "PAYMENT" || rawSource === "REFUND" || rawSource === "COMMISSION"
        ? rawSource
        : undefined;
    const sort: "newest" | "oldest" =
      rawSort === "oldest" ? "oldest" : "newest";

    const data = await this._listWalletTransactionsUseCase.execute({
      page,
      limit,
      type,
      source,
      sort,
    });

    res.status(200).json({
      success: true,
      data,
    });
  }

  private parseSalesReportQuery(req: Request): {
    startDate: Date | null;
    endDate: Date | null;
  } {
    const startStr = req.query.startDate as string | undefined;
    const endStr = req.query.endDate as string | undefined;
    const startDate =
      startStr && !Number.isNaN(Date.parse(startStr))
        ? new Date(startStr)
        : null;
    const endDate =
      endStr && !Number.isNaN(Date.parse(endStr)) ? new Date(endStr) : null;
    return { startDate, endDate };
  }

  async getSalesReport(req: Request, res: Response): Promise<void> {
    const { startDate, endDate } = this.parseSalesReportQuery(req);
    const data = await this._getAdminSalesReportUseCase.execute({
      startDate,
      endDate,
    });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }

  async getSalesReportPdf(req: Request, res: Response): Promise<void> {
    const { startDate, endDate } = this.parseSalesReportQuery(req);
    const data = await this._getAdminSalesReportUseCase.execute({
      startDate,
      endDate,
    });
    const payload = toExportPayload(data, "Admin Sales Report");
    const buffer = await this._exportSalesReportUseCase.execute(payload, "pdf");
    const filename = `admin-sales-report-${payload.startDate ?? "all"}-${payload.endDate ?? "all"}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.send(buffer);
  }

  async getSalesReportExcel(req: Request, res: Response): Promise<void> {
    const { startDate, endDate } = this.parseSalesReportQuery(req);
    const data = await this._getAdminSalesReportUseCase.execute({
      startDate,
      endDate,
    });
    const payload = toExportPayload(data, "Admin Sales Report");
    const buffer = await this._exportSalesReportUseCase.execute(
      payload,
      "excel"
    );
    const filename = `admin-sales-report-${payload.startDate ?? "all"}-${payload.endDate ?? "all"}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.send(buffer);
  }
}
