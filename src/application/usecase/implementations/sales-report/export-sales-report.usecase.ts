import { inject, injectable } from "tsyringe";
import type {
  IExportSalesReportUseCase,
  ExportFormat,
} from "../../interfaces/sales-report/export-sales-report.interface";
import type {
  ISalesReportExportService,
  SalesReportExportPayload,
} from "../../../../domain/service-interfaces/sales-report-export-service.interface";

@injectable()
export class ExportSalesReportUseCase implements IExportSalesReportUseCase {
  constructor(
    @inject("ISalesReportExportService")
    private readonly _exportService: ISalesReportExportService
  ) {}

  async execute(
    payload: SalesReportExportPayload,
    format: ExportFormat
  ): Promise<Buffer> {
    if (format === "pdf") {
      return this._exportService.generatePdf(payload);
    }
    if (format === "excel") {
      return this._exportService.generateExcel(payload);
    }
    throw new Error(`Unsupported export format: ${format}`);
  }
}
