import { injectable } from "tsyringe";
import mongoose from "mongoose";
import { bookingDB } from "../../database/models/booking.model";
import type {
  ISalesReportRepository,
  AdminSalesReportAggregationResult,
  AgencySalesReportAggregationResult,
} from "../../../domain/repositoryInterfaces/SalesReport/sales-report.repository.interface";

@injectable()
export class SalesReportRepository implements ISalesReportRepository {
  async getAdminSalesReport(
    startDate: Date | null,
    endDate: Date | null
  ): Promise<AdminSalesReportAggregationResult> {
    const matchStage: Record<string, unknown> = { status: "CONFIRMED" };
    if (startDate != null || endDate != null) {
      matchStage.createdAt = {};
      if (startDate != null) {
        (matchStage.createdAt as Record<string, Date>).$gte = startDate;
      }
      if (endDate != null) {
        (matchStage.createdAt as Record<string, Date>).$lte = endDate;
      }
    }

    const pipeline: mongoose.PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageDoc",
        },
      },
      {
        $lookup: {
          from: "agencies",
          localField: "agencyId",
          foreignField: "_id",
          as: "agencyDoc",
        },
      },
      {
        $addFields: {
          packageName: {
            $ifNull: [
              { $arrayElemAt: ["$packageDoc.PackageName", 0] },
              "Unknown",
            ],
          },
          agencyName: {
            $ifNull: [
              { $arrayElemAt: ["$agencyDoc.agencyName", 0] },
              "Unknown",
            ],
          },
        },
      },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalBookings: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
              },
            },
          ],
          dateWiseSales: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                bookingCount: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
              },
            },
            { $sort: { _id: 1 } },
          ],
          topPackages: [
            {
              $group: {
                _id: "$packageId",
                packageName: { $first: "$packageName" },
                bookingCount: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
          ],
          topAgencies: [
            {
              $group: {
                _id: "$agencyId",
                agencyName: { $first: "$agencyName" },
                bookingCount: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
          ],
          rows: [
            {
              $project: {
                bookingId: {
                  $toString: {
                    $ifNull: ["$bookingId", "$_id"],
                  },
                },
                packageName: 1,
                agencyName: 1,
                totalAmount: 1,
                currency: 1,
                status: 1,
                createdAt: 1,
                paidAt: 1,
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 500 },
          ],
        },
      },
    ];

    const results = await bookingDB.aggregate(pipeline).exec();
    const facet = results[0] as AdminSalesReportAggregationResult | undefined;

    if (!facet) {
      return {
        summary: [{ totalBookings: 0, totalRevenue: 0 }],
        dateWiseSales: [],
        topPackages: [],
        topAgencies: [],
        rows: [],
      };
    }

    const summary = Array.isArray(facet.summary)
      ? facet.summary
      : [{ totalBookings: 0, totalRevenue: 0 }];
    const dateWiseSales = Array.isArray(facet.dateWiseSales)
      ? facet.dateWiseSales.map((d) => ({
          _id: String(d._id),
          bookingCount: d.bookingCount,
          revenue: d.revenue,
        }))
      : [];
    const topPackages = Array.isArray(facet.topPackages)
      ? facet.topPackages.map((p) => ({
          _id: String(p._id),
          packageName: p.packageName ?? "Unknown",
          bookingCount: p.bookingCount,
          revenue: p.revenue,
        }))
      : [];
    const topAgencies = Array.isArray(facet.topAgencies)
      ? facet.topAgencies.map((a) => ({
          _id: String(a._id),
          agencyName: a.agencyName ?? "Unknown",
          bookingCount: a.bookingCount,
          revenue: a.revenue,
        }))
      : [];
    const rows = Array.isArray(facet.rows)
      ? facet.rows.map((r) => ({
          bookingId: String(r.bookingId),
          packageName: String(r.packageName ?? "Unknown"),
          agencyName: String(r.agencyName ?? "Unknown"),
          totalAmount: Number(r.totalAmount),
          currency: String(r.currency ?? "inr"),
          status: String(r.status),
          createdAt: r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt),
          paidAt: r.paidAt instanceof Date ? r.paidAt : r.paidAt ? new Date(r.paidAt) : null,
        }))
      : [];

    return {
      summary: [{ totalBookings: summary[0]?.totalBookings ?? 0, totalRevenue: summary[0]?.totalRevenue ?? 0 }],
      dateWiseSales,
      topPackages,
      topAgencies,
      rows,
    };
  }

  async getAgencySalesReport(
    agencyId: string,
    startDate: Date | null,
    endDate: Date | null
  ): Promise<AgencySalesReportAggregationResult> {
    const matchStage: Record<string, unknown> = {
      status: "CONFIRMED",
      agencyId: new mongoose.Types.ObjectId(agencyId),
    };
    if (startDate != null || endDate != null) {
      matchStage.createdAt = {};
      if (startDate != null) {
        (matchStage.createdAt as Record<string, Date>).$gte = startDate;
      }
      if (endDate != null) {
        (matchStage.createdAt as Record<string, Date>).$lte = endDate;
      }
    }

    const pipeline: mongoose.PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "packageDoc",
        },
      },
      {
        $lookup: {
          from: "agencies",
          localField: "agencyId",
          foreignField: "_id",
          as: "agencyDoc",
        },
      },
      {
        $addFields: {
          packageName: {
            $ifNull: [
              { $arrayElemAt: ["$packageDoc.PackageName", 0] },
              "Unknown",
            ],
          },
          agencyName: {
            $ifNull: [
              { $arrayElemAt: ["$agencyDoc.agencyName", 0] },
              "Unknown",
            ],
          },
        },
      },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalBookings: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
              },
            },
          ],
          dateWiseSales: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                bookingCount: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
              },
            },
            { $sort: { _id: 1 } },
          ],
          topPackages: [
            {
              $group: {
                _id: "$packageId",
                packageName: { $first: "$packageName" },
                bookingCount: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
          ],
          rows: [
            {
              $project: {
                bookingId: {
                  $toString: {
                    $ifNull: ["$bookingId", "$_id"],
                  },
                },
                packageName: 1,
                agencyName: 1,
                totalAmount: 1,
                currency: 1,
                status: 1,
                createdAt: 1,
                paidAt: 1,
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 500 },
          ],
        },
      },
    ];

    const results = await bookingDB.aggregate(pipeline).exec();
    const facet = results[0] as AgencySalesReportAggregationResult | undefined;

    if (!facet) {
      return {
        summary: [{ totalBookings: 0, totalRevenue: 0 }],
        dateWiseSales: [],
        topPackages: [],
        rows: [],
      };
    }

    const summary = Array.isArray(facet.summary)
      ? facet.summary
      : [{ totalBookings: 0, totalRevenue: 0 }];
    const dateWiseSales = Array.isArray(facet.dateWiseSales)
      ? facet.dateWiseSales.map((d) => ({
          _id: String(d._id),
          bookingCount: d.bookingCount,
          revenue: d.revenue,
        }))
      : [];
    const topPackages = Array.isArray(facet.topPackages)
      ? facet.topPackages.map((p) => ({
          _id: String(p._id),
          packageName: p.packageName ?? "Unknown",
          bookingCount: p.bookingCount,
          revenue: p.revenue,
        }))
      : [];
    const rows = Array.isArray(facet.rows)
      ? facet.rows.map((r) => ({
          bookingId: String(r.bookingId),
          packageName: String(r.packageName ?? "Unknown"),
          agencyName: String(r.agencyName ?? "Unknown"),
          totalAmount: Number(r.totalAmount),
          currency: String(r.currency ?? "inr"),
          status: String(r.status),
          createdAt: r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt),
          paidAt: r.paidAt instanceof Date ? r.paidAt : r.paidAt ? new Date(r.paidAt) : null,
        }))
      : [];

    return {
      summary: [{ totalBookings: summary[0]?.totalBookings ?? 0, totalRevenue: summary[0]?.totalRevenue ?? 0 }],
      dateWiseSales,
      topPackages,
      rows,
    };
  }
}
