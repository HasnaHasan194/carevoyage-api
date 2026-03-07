import type { AdminSalesReportResponseDTO } from "../../../dto/response/sales-report-response.dto";

export interface GetAdminSalesReportParams {
  startDate: Date | null;
  endDate: Date | null;
}

export interface IGetAdminSalesReportUseCase {
  execute(params: GetAdminSalesReportParams): Promise<AdminSalesReportResponseDTO>;
}
