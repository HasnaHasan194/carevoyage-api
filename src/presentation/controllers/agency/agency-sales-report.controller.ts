import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import type { IAgencySalesReportController } from "../../interfaces/controllers/agency/agency-sales-report.controller.interface";
import type { IGetAgencySalesReportUseCase } from "../../../application/usecase/interfaces/sales-report/get-agency-sales-report.interface";
import type { IExportSalesReportUseCase } from "../../../application/usecase/interfaces/sales-report/export-sales-report.interface";
import type { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { NotFoundError } from "../../../domain/errors/notFoundError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../../shared/constants/constants";
import { toExportPayload } from "../../../application/mapper/sales-report.mapper";

@injectable()
export class AgencySalesReportController
  implements IAgencySalesReportController
{
  constructor(
    @inject("IGetAgencySalesReportUseCase")
    private readonly _getAgencySalesReportUseCase: IGetAgencySalesReportUseCase,
    @inject("IExportSalesReportUseCase")
    private readonly _exportSalesReportUseCase: IExportSalesReportUseCase,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository
  ) {}

  private async getAgencyId(req: CustomRequest): Promise<string> {
    if (!req.user) {
      throw new NotFoundError(
        ERROR_MESSAGE.AUTHENTICATION.USER_NOT_AUTHENTICATED
      );
    }
    const agency = await this._agencyRepository.findByUserId(req.user.id);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }
    return agency._id;
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
    const customReq = req as CustomRequest;
    const agencyId = await this.getAgencyId(customReq);
    const { startDate, endDate } = this.parseSalesReportQuery(req);
    const data = await this._getAgencySalesReportUseCase.execute({
      agencyId,
      startDate,
      endDate,
    });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  }

  async getSalesReportPdf(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agencyId = await this.getAgencyId(customReq);
    const { startDate, endDate } = this.parseSalesReportQuery(req);
    const data = await this._getAgencySalesReportUseCase.execute({
      agencyId,
      startDate,
      endDate,
    });
    const payload = toExportPayload(data, "Agency Sales Report");
    const buffer = await this._exportSalesReportUseCase.execute(
      payload,
      "pdf"
    );
    const filename = `agency-sales-report-${payload.startDate ?? "all"}-${payload.endDate ?? "all"}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  }

  async getSalesReportExcel(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agencyId = await this.getAgencyId(customReq);
    const { startDate, endDate } = this.parseSalesReportQuery(req);
    const data = await this._getAgencySalesReportUseCase.execute({
      agencyId,
      startDate,
      endDate,
    });
    const payload = toExportPayload(data, "Agency Sales Report");
    const buffer = await this._exportSalesReportUseCase.execute(
      payload,
      "excel"
    );
    const filename = `agency-sales-report-${payload.startDate ?? "all"}-${payload.endDate ?? "all"}.xlsx`;
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
