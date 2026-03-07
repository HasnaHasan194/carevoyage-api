export interface SalesReportSummaryDTO {
  totalBookings: number;
  totalRevenue: number;
  currency: string;
}

export interface DateWiseSalesDTO {
  date: string;
  bookingCount: number;
  revenue: number;
}

export interface TopPackageDTO {
  packageId: string;
  packageName: string;
  bookingCount: number;
  revenue: number;
}

export interface TopAgencyDTO {
  agencyId: string;
  agencyName: string;
  bookingCount: number;
  revenue: number;
}

export interface SalesReportRowDTO {
  bookingId: string;
  packageName: string;
  agencyName: string;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  paidAt?: string;
}

export interface AdminSalesReportResponseDTO {
  summary: SalesReportSummaryDTO;
  dateWiseSales: DateWiseSalesDTO[];
  topPackages: TopPackageDTO[];
  topAgencies: TopAgencyDTO[];
  rows: SalesReportRowDTO[];
  startDate: string | null;
  endDate: string | null;
}

export interface AgencySalesReportResponseDTO {
  summary: SalesReportSummaryDTO;
  dateWiseSales: DateWiseSalesDTO[];
  topPackages: TopPackageDTO[];
  rows: SalesReportRowDTO[];
  startDate: string | null;
  endDate: string | null;
}
