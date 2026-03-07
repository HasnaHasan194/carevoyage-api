import { inject, injectable } from "tsyringe";
import type {
  ISalesReportExportService,
  SalesReportExportPayload,
} from "../../../domain/service-interfaces/sales-report-export-service.interface";

@injectable()
export class SalesReportExportService implements ISalesReportExportService {
  constructor(
    @inject("ISalesReportPdfExportService")
    private readonly _pdfService: ISalesReportExportService,
    @inject("ISalesReportExcelExportService")
    private readonly _excelService: ISalesReportExportService
  ) {}

  async generatePdf(payload: SalesReportExportPayload): Promise<Buffer> {
    return this._pdfService.generatePdf(payload);
  }

  async generateExcel(payload: SalesReportExportPayload): Promise<Buffer> {
    return this._excelService.generateExcel(payload);
  }
}
