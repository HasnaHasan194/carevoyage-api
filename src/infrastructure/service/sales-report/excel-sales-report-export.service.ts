import { injectable } from "tsyringe";
import ExcelJS from "exceljs";
import type {
  ISalesReportExportService,
  SalesReportExportPayload,
} from "../../../domain/service-interfaces/sales-report-export-service.interface";

@injectable()
export class ExcelSalesReportExportService implements ISalesReportExportService {
  async generatePdf(_payload: SalesReportExportPayload): Promise<Buffer> {
    throw new Error("Use PdfSalesReportExportService for PDF export");
  }

  async generateExcel(payload: SalesReportExportPayload): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "CareVoyage";
    const sheet = workbook.addWorksheet("Sales Report", {
      headerFooter: { firstHeader: payload.reportTitle },
    });

    sheet.getCell("A1").value = payload.reportTitle;
    sheet.getCell("A1").font = { size: 16, bold: true };
    sheet.mergeCells("A1:F1");

    const dateRange =
      payload.startDate && payload.endDate
        ? `${payload.startDate} to ${payload.endDate}`
        : "All time";
    sheet.getCell("A2").value = `Date range: ${dateRange}`;
    sheet.getCell("A2").font = { size: 10 };

    let row = 4;
    sheet.getCell(`A${row}`).value = "Summary";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
    sheet.getCell(`A${row}`).value = "Total bookings:";
    sheet.getCell(`B${row}`).value = payload.summary.totalBookings;
    row++;
    sheet.getCell(`A${row}`).value = "Total revenue:";
    sheet.getCell(`B${row}`).value = payload.summary.totalRevenue;
    sheet.getCell(`C${row}`).value = payload.summary.currency.toUpperCase();
    row += 2;

    if (payload.topPackages.length > 0) {
      sheet.getCell(`A${row}`).value = "Top packages";
      sheet.getCell(`A${row}`).font = { bold: true };
      row++;
      sheet.getCell(`A${row}`).value = "Package";
      sheet.getCell(`B${row}`).value = "Bookings";
      sheet.getCell(`C${row}`).value = "Revenue";
      sheet.getRow(row).font = { bold: true };
      row++;
      payload.topPackages.forEach((p) => {
        sheet.getCell(`A${row}`).value = p.packageName;
        sheet.getCell(`B${row}`).value = p.bookingCount;
        sheet.getCell(`C${row}`).value = p.revenue;
        row++;
      });
      row++;
    }

    if (payload.topAgencies && payload.topAgencies.length > 0) {
      sheet.getCell(`A${row}`).value = "Top agencies";
      sheet.getCell(`A${row}`).font = { bold: true };
      row++;
      sheet.getCell(`A${row}`).value = "Agency";
      sheet.getCell(`B${row}`).value = "Bookings";
      sheet.getCell(`C${row}`).value = "Revenue";
      sheet.getRow(row).font = { bold: true };
      row++;
      payload.topAgencies.forEach((a) => {
        sheet.getCell(`A${row}`).value = a.agencyName;
        sheet.getCell(`B${row}`).value = a.bookingCount;
        sheet.getCell(`C${row}`).value = a.revenue;
        row++;
      });
      row++;
    }

    sheet.getCell(`A${row}`).value = "Sales details";
    sheet.getCell(`A${row}`).font = { bold: true };
    row++;
    const headers = [
      "Booking ID",
      "Package",
      "Agency",
      "Amount",
      "Currency",
      "Status",
      "Created At",
      "Paid At",
    ];
    headers.forEach((h, i) => {
      sheet.getCell(row, i + 1).value = h;
    });
    sheet.getRow(row).font = { bold: true };
    row++;

    payload.rows.forEach((r) => {
      sheet.getCell(row, 1).value = r.bookingId;
      sheet.getCell(row, 2).value = r.packageName;
      sheet.getCell(row, 3).value = r.agencyName;
      sheet.getCell(row, 4).value = r.totalAmount;
      sheet.getCell(row, 5).value = r.currency;
      sheet.getCell(row, 6).value = r.status;
      sheet.getCell(row, 7).value = r.createdAt;
      sheet.getCell(row, 8).value = r.paidAt ?? "";
      row++;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer as ArrayBuffer);
  }
}
