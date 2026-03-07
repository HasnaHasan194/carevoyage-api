export interface SalesReportExportPayload {
  summary: {
    totalBookings: number;
    totalRevenue: number;
    currency: string;
  };
  dateWiseSales: Array<{
    date: string;
    bookingCount: number;
    revenue: number;
  }>;
  topPackages: Array<{
    packageName: string;
    bookingCount: number;
    revenue: number;
  }>;
  topAgencies?: Array<{
    agencyName: string;
    bookingCount: number;
    revenue: number;
  }>;
  rows: Array<{
    bookingId: string;
    packageName: string;
    agencyName: string;
    totalAmount: number;
    currency: string;
    status: string;
    createdAt: string;
    paidAt?: string;
  }>;
  startDate: string | null;
  endDate: string | null;
  reportTitle: string;
}

export interface ISalesReportExportService {
  generatePdf(payload: SalesReportExportPayload): Promise<Buffer>;
  generateExcel(payload: SalesReportExportPayload): Promise<Buffer>;
}
