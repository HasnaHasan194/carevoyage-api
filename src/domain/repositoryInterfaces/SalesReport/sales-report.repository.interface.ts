export interface AdminSalesReportAggregationResult {
  summary: Array<{ totalBookings: number; totalRevenue: number }>;
  dateWiseSales: Array<{
    _id: string;
    bookingCount: number;
    revenue: number;
  }>;
  topPackages: Array<{
    _id: string;
    packageName: string;
    bookingCount: number;
    revenue: number;
  }>;
  topAgencies: Array<{
    _id: string;
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
    createdAt: Date;
    paidAt: Date | null;
  }>;
}

export interface AgencySalesReportAggregationResult {
  summary: Array<{ totalBookings: number; totalRevenue: number }>;
  dateWiseSales: Array<{
    _id: string;
    bookingCount: number;
    revenue: number;
  }>;
  topPackages: Array<{
    _id: string;
    packageName: string;
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
    createdAt: Date;
    paidAt: Date | null;
  }>;
}

export interface ISalesReportRepository {
  getAdminSalesReport(
    startDate: Date | null,
    endDate: Date | null
  ): Promise<AdminSalesReportAggregationResult>;

  getAgencySalesReport(
    agencyId: string,
    startDate: Date | null,
    endDate: Date | null
  ): Promise<AgencySalesReportAggregationResult>;
}
