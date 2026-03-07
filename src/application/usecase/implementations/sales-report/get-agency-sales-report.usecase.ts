import { inject, injectable } from "tsyringe";
import type {
  IGetAgencySalesReportUseCase,
  GetAgencySalesReportParams,
} from "../../interfaces/sales-report/get-agency-sales-report.interface";
import type { AgencySalesReportResponseDTO } from "../../../dto/response/sales-report-response.dto";
import type { ISalesReportRepository } from "../../../../domain/repositoryInterfaces/SalesReport/sales-report.repository.interface";
import { toAgencySalesReportDTO } from "../../../mapper/sales-report.mapper";

@injectable()
export class GetAgencySalesReportUseCase implements IGetAgencySalesReportUseCase {
  constructor(
    @inject("ISalesReportRepository")
    private readonly _salesReportRepository: ISalesReportRepository
  ) {}

  async execute(
    params: GetAgencySalesReportParams
  ): Promise<AgencySalesReportResponseDTO> {
    const result = await this._salesReportRepository.getAgencySalesReport(
      params.agencyId,
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
    return toAgencySalesReportDTO(result, startStr, endStr);
  }
}
