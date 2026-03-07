import { inject, injectable } from "tsyringe";
import type {
  IGetAdminSalesReportUseCase,
  GetAdminSalesReportParams,
} from "../../interfaces/sales-report/get-admin-sales-report.interface";
import type { AdminSalesReportResponseDTO } from "../../../dto/response/sales-report-response.dto";
import type { ISalesReportRepository } from "../../../../domain/repositoryInterfaces/SalesReport/sales-report.repository.interface";
import { toAdminSalesReportDTO } from "../../../mapper/sales-report.mapper";

@injectable()
export class GetAdminSalesReportUseCase implements IGetAdminSalesReportUseCase {
  constructor(
    @inject("ISalesReportRepository")
    private readonly _salesReportRepository: ISalesReportRepository
  ) {}

  async execute(
    params: GetAdminSalesReportParams
  ): Promise<AdminSalesReportResponseDTO> {
    const result = await this._salesReportRepository.getAdminSalesReport(
      params.startDate,
      params.endDate
    );
    const startStr =
      params.startDate != null
        ? (params.startDate instanceof Date
            ? params.startDate
            : new Date(params.startDate)
          ).toISOString()
          .slice(0, 10)
        : null;
    const endStr =
      params.endDate != null
        ? (params.endDate instanceof Date
            ? params.endDate
            : new Date(params.endDate)
          ).toISOString()
          .slice(0, 10)
        : null;
    return toAdminSalesReportDTO(result, startStr, endStr);
  }
}
