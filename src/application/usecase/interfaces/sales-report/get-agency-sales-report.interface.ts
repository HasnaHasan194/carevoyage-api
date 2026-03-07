import type { AgencySalesReportResponseDTO } from "../../../dto/response/sales-report-response.dto";

export interface GetAgencySalesReportParams {
  agencyId: string;
  startDate: Date | null;
  endDate: Date | null;
}

export interface IGetAgencySalesReportUseCase {
  execute(
    params: GetAgencySalesReportParams
  ): Promise<AgencySalesReportResponseDTO>;
}
