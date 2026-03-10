import { injectable } from "tsyringe";
import mongoose from "mongoose";
import { bookingDB } from "../../database/models/booking.model";
import type {
  ICaretakerDashboardRepository,
  CaretakerDashboardStats,
  CaretakerNextTripRow,
  CaretakerAssignedTripRow,
} from "../../../domain/repositoryInterfaces/CaretakerDashboard/caretaker-dashboard.repository.interface";

/** Filter shape for caretaker CONFIRMED bookings (mongoose 9 does not export QueryFilter). */
interface CaretakerBookingCountFilter {
  caretakerId: mongoose.Types.ObjectId;
  status: string;
  startDate?: { $gt: Date } | { $lte: Date };
}
type BookingCountDocumentsParam = Parameters<typeof bookingDB.countDocuments>[0];

const CONFIRMED_STATUS = "CONFIRMED";
const MS_PER_DAY = 86400000;

function getStartOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getStartOfMonth(d: Date): Date {
  const date = new Date(d);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getStartOfYear(d: Date): Date {
  const date = new Date(d);
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

@injectable()
export class CaretakerDashboardRepository
  implements ICaretakerDashboardRepository
{
  async getDashboardStats(
    caretakerId: string
  ): Promise<CaretakerDashboardStats> {
    const careId = new mongoose.Types.ObjectId(caretakerId);
    const now = new Date();
    const weekStart = getStartOfWeek(now);
    const monthStart = getStartOfMonth(now);
    const yearStart = getStartOfYear(now);

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: {
          caretakerId: careId,
          status: CONFIRMED_STATUS,
        },
      },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "pkg",
        },
      },
      { $unwind: { path: "$pkg", preserveNullAndEmptyArrays: false } },
      {
        $addFields: {
          tripDays: {
            $max: [
              1,
              {
                $ceil: {
                  $divide: [
                    { $subtract: ["$pkg.endDate", "$pkg.startDate"] },
                    MS_PER_DAY,
                  ],
                },
              },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "caretaker_profiles",
          localField: "caretakerId",
          foreignField: "_id",
          as: "caretaker",
        },
      },
      {
        $addFields: {
          pricePerDay: {
            $ifNull: [
              { $arrayElemAt: ["$caretaker.pricePerDay", 0] },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          income: { $multiply: ["$pricePerDay", "$tripDays"] },
        },
      },
      {
        $facet: {
          totalIncome: [
            { $group: { _id: null, sum: { $sum: "$income" } } },
          ],
          weeklyIncome: [
            { $match: { startDate: { $gte: weekStart } } },
            { $group: { _id: null, sum: { $sum: "$income" } } },
          ],
          monthlyIncome: [
            { $match: { startDate: { $gte: monthStart } } },
            { $group: { _id: null, sum: { $sum: "$income" } } },
          ],
          yearlyIncome: [
            { $match: { startDate: { $gte: yearStart } } },
            { $group: { _id: null, sum: { $sum: "$income" } } },
          ],
        },
      },
    ];

    const [result] = await bookingDB.aggregate(pipeline).exec();
    const facet = result as {
      totalIncome?: Array<{ sum: number }>;
      weeklyIncome?: Array<{ sum: number }>;
      monthlyIncome?: Array<{ sum: number }>;
      yearlyIncome?: Array<{ sum: number }>;
    } | undefined;

    const totalIncome =
      (Array.isArray(facet?.totalIncome) && facet.totalIncome[0]?.sum) || 0;
    const weeklyIncome =
      (Array.isArray(facet?.weeklyIncome) && facet.weeklyIncome[0]?.sum) || 0;
    const monthlyIncome =
      (Array.isArray(facet?.monthlyIncome) && facet.monthlyIncome[0]?.sum) || 0;
    const yearlyIncome =
      (Array.isArray(facet?.yearlyIncome) && facet.yearlyIncome[0]?.sum) || 0;

    const baseFilter: CaretakerBookingCountFilter = {
      caretakerId: careId,
      status: CONFIRMED_STATUS,
    };
    const [totalTrips, upcomingCount, completedCount] = await Promise.all([
      bookingDB.countDocuments(baseFilter as unknown as BookingCountDocumentsParam),
      bookingDB.countDocuments({
        ...baseFilter,
        startDate: { $gt: now },
      } as unknown as BookingCountDocumentsParam),
      bookingDB.countDocuments({
        ...baseFilter,
        startDate: { $lte: now },
      } as unknown as BookingCountDocumentsParam),
    ]);

    return {
      totalIncome,
      weeklyIncome,
      monthlyIncome,
      yearlyIncome,
      totalTrips,
      upcomingTripsCount: upcomingCount,
      completedTripsCount: completedCount,
    };
  }

  async getNextTrip(
    caretakerId: string
  ): Promise<CaretakerNextTripRow | null> {
    const careId = new mongoose.Types.ObjectId(caretakerId);
    const now = new Date();

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: {
          caretakerId: careId,
          status: CONFIRMED_STATUS,
          startDate: { $gte: now },
        },
      },
      { $sort: { startDate: 1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "pkg",
        },
      },
      { $unwind: { path: "$pkg", preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $addFields: {
          packageName: "$pkg.PackageName",
          clientName: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: [{ $arrayElemAt: ["$client.firstName", 0] }, ""] },
                  " ",
                  { $ifNull: [{ $arrayElemAt: ["$client.lastName", 0] }, ""] },
                ],
              },
            },
          },
          endDate: "$pkg.endDate",
        },
      },
      {
        $project: {
          bookingId: { $toString: "$_id" },
          packageName: 1,
          clientName: 1,
          startDate: 1,
          endDate: 1,
          status: 1,
        },
      },
    ];

    const rows = await bookingDB.aggregate(pipeline).exec();
    const row = rows[0] as
      | {
          bookingId: string;
          packageName: string;
          clientName: string;
          startDate: Date;
          endDate: Date;
          status: string;
        }
      | undefined;

    if (!row) return null;

    return {
      bookingId: row.bookingId,
      packageName: String(row.packageName ?? "").trim(),
      clientName: String(row.clientName ?? "").trim(),
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
    };
  }

  async getAssignedTripsPaginated(
    caretakerId: string,
    page: number,
    limit: number
  ): Promise<{ trips: CaretakerAssignedTripRow[]; total: number }> {
    const careId = new mongoose.Types.ObjectId(caretakerId);
    const skip = (page - 1) * limit;

    const [trips, total] = await Promise.all([
      bookingDB
        .aggregate([
          { $match: { caretakerId: careId, status: CONFIRMED_STATUS } },
          { $sort: { startDate: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "packages",
              localField: "packageId",
              foreignField: "_id",
              as: "pkg",
            },
          },
          { $unwind: { path: "$pkg", preserveNullAndEmptyArrays: false } },
          {
            $lookup: {
              from: "users",
              localField: "clientId",
              foreignField: "_id",
              as: "client",
            },
          },
          {
            $addFields: {
              packageName: "$pkg.PackageName",
              clientName: {
                $trim: {
                  input: {
                    $concat: [
                      { $ifNull: [{ $arrayElemAt: ["$client.firstName", 0] }, ""] },
                      " ",
                      { $ifNull: [{ $arrayElemAt: ["$client.lastName", 0] }, ""] },
                    ],
                  },
                },
              },
              endDate: "$pkg.endDate",
            },
          },
          {
            $project: {
              bookingId: { $toString: "$_id" },
              packageName: 1,
              clientName: 1,
              startDate: 1,
              endDate: 1,
              status: 1,
            },
          },
        ])
        .exec(),
      bookingDB.countDocuments({
        caretakerId: careId,
        status: CONFIRMED_STATUS,
      } as unknown as BookingCountDocumentsParam),
    ]);

    const typedTrips: CaretakerAssignedTripRow[] = (trips as Record<string, unknown>[]).map(
      (r) => ({
        bookingId: String(r.bookingId),
        packageName: String(r.packageName ?? ""),
        clientName: String(r.clientName ?? ""),
        startDate: r.startDate instanceof Date ? r.startDate : new Date(r.startDate as string),
        endDate: r.endDate instanceof Date ? r.endDate : new Date(r.endDate as string),
        status: String(r.status),
      })
    );

    return { trips: typedTrips, total };
  }
}
