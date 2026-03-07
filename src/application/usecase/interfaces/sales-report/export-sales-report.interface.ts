import type { SalesReportExportPayload } from "../../../../domain/service-interfaces/sales-report-export-service.interface";

export type ExportFormat = "pdf" | "excel";

export interface IExportSalesReportUseCase {
  execute(
    payload: SalesReportExportPayload,
    format: ExportFormat
  ): Promise<Buffer>;
}
