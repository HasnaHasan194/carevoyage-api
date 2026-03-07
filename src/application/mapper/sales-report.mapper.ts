import type { AdminSalesReportAggregationResult } from "../../domain/repositoryInterfaces/SalesReport/sales-report.repository.interface";
import type { AgencySalesReportAggregationResult } from "../../domain/repositoryInterfaces/SalesReport/sales-report.repository.interface";
import type {
  AdminSalesReportResponseDTO,
  AgencySalesReportResponseDTO,
  DateWiseSalesDTO,
  TopPackageDTO,
  TopAgencyDTO,
  SalesReportRowDTO,
} from "../dto/response/sales-report-response.dto";
import type { SalesReportExportPayload } from "../../domain/service-interfaces/sales-report-export-service.interface";

const DEFAULT_CURRENCY = "inr";

export function toAdminSalesReportDTO(
  result: AdminSalesReportAggregationResult,
  startDate: string | null,
  endDate: string | null
): AdminSalesReportResponseDTO {
  const summaryRow = result.summary[0];
  const totalBookings = summaryRow?.totalBookings ?? 0;
  const totalRevenue = summaryRow?.totalRevenue ?? 0;

  const dateWiseSales: DateWiseSalesDTO[] = result.dateWiseSales.map((d) => ({
    date: d._id,
    bookingCount: d.bookingCount,
    revenue: d.revenue,
  }));

  const topPackages: TopPackageDTO[] = result.topPackages.map((p) => ({
    packageId: p._id,
    packageName: p.packageName,
    bookingCount: p.bookingCount,
    revenue: p.revenue,
  }));

  const topAgencies: TopAgencyDTO[] = result.topAgencies.map((a) => ({
    agencyId: a._id,
    agencyName: a.agencyName,
    bookingCount: a.bookingCount,
    revenue: a.revenue,
  }));

  const rows: SalesReportRowDTO[] = result.rows.map((r) => ({
    bookingId: r.bookingId,
    packageName: r.packageName,
    agencyName: r.agencyName,
    totalAmount: r.totalAmount,
    currency: r.currency,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    paidAt: r.paidAt ? r.paidAt.toISOString() : undefined,
  }));

  return {
    summary: {
      totalBookings,
      totalRevenue,
      currency: DEFAULT_CURRENCY,
    },
    dateWiseSales,
    topPackages,
    topAgencies,
    rows,
    startDate,
    endDate,
  };
}

export function toAgencySalesReportDTO(
  result: AgencySalesReportAggregationResult,
  startDate: string | null,
  endDate: string | null
): AgencySalesReportResponseDTO {
  const summaryRow = result.summary[0];
  const totalBookings = summaryRow?.totalBookings ?? 0;
  const totalRevenue = summaryRow?.totalRevenue ?? 0;

  const dateWiseSales: DateWiseSalesDTO[] = result.dateWiseSales.map((d) => ({
    date: d._id,
    bookingCount: d.bookingCount,
    revenue: d.revenue,
  }));

  const topPackages: TopPackageDTO[] = result.topPackages.map((p) => ({
    packageId: p._id,
    packageName: p.packageName,
    bookingCount: p.bookingCount,
    revenue: p.revenue,
  }));

  const rows: SalesReportRowDTO[] = result.rows.map((r) => ({
    bookingId: r.bookingId,
    packageName: r.packageName,
    agencyName: r.agencyName,
    totalAmount: r.totalAmount,
    currency: r.currency,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    paidAt: r.paidAt ? r.paidAt.toISOString() : undefined,
  }));

  return {
    summary: {
      totalBookings,
      totalRevenue,
      currency: DEFAULT_CURRENCY,
    },
    dateWiseSales,
    topPackages,
    rows,
    startDate,
    endDate,
  };
}

export function toExportPayload(
  data: AdminSalesReportResponseDTO | AgencySalesReportResponseDTO,
  reportTitle: string
): SalesReportExportPayload {
  const payload: SalesReportExportPayload = {
    summary: data.summary,
    dateWiseSales: data.dateWiseSales,
    topPackages: data.topPackages.map((p) => ({
      packageName: p.packageName,
      bookingCount: p.bookingCount,
      revenue: p.revenue,
    })),
    rows: data.rows,
    startDate: data.startDate,
    endDate: data.endDate,
    reportTitle,
  };
  if ("topAgencies" in data && data.topAgencies != null) {
    payload.topAgencies = data.topAgencies.map((a) => ({
      agencyName: a.agencyName,
      bookingCount: a.bookingCount,
      revenue: a.revenue,
    }));
  }
  return payload;
}
