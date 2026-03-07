import { injectable } from "tsyringe";
import type {
  ISalesReportExportService,
  SalesReportExportPayload,
} from "../../../domain/service-interfaces/sales-report-export-service.interface";

interface PDFDocType {
  on(event: string, fn: (chunk?: Buffer) => void): void;
  fontSize(size: number): PDFDocType;
  text(
    text: string,
    xOrOptions?: number | Record<string, unknown>,
    y?: number,
    options?: Record<string, unknown>
  ): PDFDocType;
  moveDown(n?: number): PDFDocType;
  y: number;
  end(): void;
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require("pdfkit") as new (options?: { margin?: number }) => PDFDocType;

@injectable()
export class PdfSalesReportExportService implements ISalesReportExportService {
  async generatePdf(payload: SalesReportExportPayload): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk?: Buffer) => {
        if (chunk) chunks.push(chunk);
      });
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.fontSize(20).text(payload.reportTitle, { align: "center" });
      doc.moveDown();

      const dateRange =
        payload.startDate && payload.endDate
          ? `Date range: ${payload.startDate} to ${payload.endDate}`
          : "Date range: All time";
      doc.fontSize(10).text(dateRange, { align: "center" });
      doc.moveDown(2);

      doc.fontSize(12).text("Summary", { underline: true });
      doc
        .fontSize(10)
        .text(
          `Total bookings: ${payload.summary.totalBookings} | Total revenue: ${payload.summary.currency.toUpperCase()} ${payload.summary.totalRevenue.toFixed(2)}`
        );
      doc.moveDown(2);

      if (payload.topPackages.length > 0) {
        doc.fontSize(12).text("Top packages", { underline: true });
        doc.fontSize(10);
        payload.topPackages.forEach((p, i) => {
          doc.text(
            `${i + 1}. ${p.packageName} - Bookings: ${p.bookingCount}, Revenue: ${p.revenue.toFixed(2)}`
          );
        });
        doc.moveDown(2);
      }

      if (payload.topAgencies && payload.topAgencies.length > 0) {
        doc.fontSize(12).text("Top agencies", { underline: true });
        doc.fontSize(10);
        payload.topAgencies.forEach((a, i) => {
          doc.text(
            `${i + 1}. ${a.agencyName} - Bookings: ${a.bookingCount}, Revenue: ${a.revenue.toFixed(2)}`
          );
        });
        doc.moveDown(2);
      }

      if (payload.rows.length > 0) {
        doc.fontSize(12).text("Sales details", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(9);
        payload.rows.slice(0, 50).forEach((row) => {
          doc.text(
            `${String(row.bookingId).slice(-8)} | ${row.packageName.slice(0, 25)} | ${row.agencyName.slice(0, 20)} | ${row.totalAmount} ${row.currency} | ${row.status} | ${row.createdAt.slice(0, 10)}`
          );
        });
        if (payload.rows.length > 50) {
          doc.moveDown(0.5);
          doc.text(`... and ${payload.rows.length - 50} more rows`);
        }
      }

      doc.end();
    });
  }

  async generateExcel(_payload: SalesReportExportPayload): Promise<Buffer> {
    throw new Error("Use ExcelSalesReportExportService for Excel export");
  }
}
