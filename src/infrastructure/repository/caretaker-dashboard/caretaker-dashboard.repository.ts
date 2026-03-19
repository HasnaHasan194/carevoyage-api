import type {
  CaretakerDashboardStats,
  CaretakerNextTrip,
  ICaretakerDashboardRepository,
} from "../../../domain/repositoryInterfaces/CaretakerDashboard/caretaker-dashboard.repository.interface";
import { bookingDB } from "../../database/models/booking.model";
import { packageDB } from "../../database/models/package.model";
import { userDB } from "../../database/models/client.model";

export class CaretakerDashboardRepository implements ICaretakerDashboardRepository {
  async getDashboardStats(caretakerProfileId: string): Promise<CaretakerDashboardStats> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Loading all bookings assigned to this caretaker that are confirmed or completed
    const bookings = await bookingDB
      .find({
        caretakerId: caretakerProfileId,
        status: { $in: ["CONFIRMED", "COMPLETED"] },
      })
      .lean()
      .exec();

    if (bookings.length === 0) {
      return {
        totalIncome: 0,
        weeklyIncome: 0,
        monthlyIncome: 0,
        yearlyIncome: 0,
        totalTrips: 0,
        upcomingTripsCount: 0,
        completedTripsCount: 0,
      };
    }

    const packageIds = Array.from(
      new Set<string>(bookings.map((b) => b.packageId.toString()))
    );

    const packages = await packageDB
      .find({ _id: { $in: packageIds } })
      .lean()
      .exec();

    const packageById = new Map<string, { startDate?: Date; endDate?: Date }>();
    packages.forEach((pkg) => {
      packageById.set(pkg._id.toString(), {
        startDate: pkg.startDate,
        endDate: pkg.endDate,
      });
    });

    let totalIncome = 0;
    let weeklyIncome = 0;
    let monthlyIncome = 0;
    let yearlyIncome = 0;

    let totalTrips = 0;
    let upcomingTripsCount = 0;
    let completedTripsCount = 0;

    bookings.forEach((booking) => {
      // Income: sum of caretakerFee for confirmed/completed trips
      const caretakerFee = typeof booking.caretakerFee === "number" ? booking.caretakerFee : 0;
      totalIncome += caretakerFee;

      const pkgDates = packageById.get(booking.packageId.toString());
      const startDate = pkgDates?.startDate ?? booking.startDate;

      if (startDate >= weekAgo && startDate <= now) {
        weeklyIncome += caretakerFee;
      }

      const startMonth = startDate.getMonth();
      const startYear = startDate.getFullYear();

      // Monthly income: sum of all assigned trips in the current calendar month
      if (startMonth === currentMonth && startYear === currentYear) {
        monthlyIncome += caretakerFee;
      }

      // Yearly income: sum of all assigned trips in the current calendar year
      if (startYear === currentYear) {
        yearlyIncome += caretakerFee;
      }

      totalTrips += 1;

      if (booking.status === "COMPLETED") {
        completedTripsCount += 1;
      }

      if (booking.status === "CONFIRMED") {
        const tripStart =
          pkgDates?.startDate ?? booking.startDate ?? booking.createdAt;
        if (tripStart > now) {
          upcomingTripsCount += 1;
        }
      }
    });

    return {
      totalIncome,
      weeklyIncome,
      monthlyIncome,
      yearlyIncome,
      totalTrips,
      upcomingTripsCount,
      completedTripsCount,
    };
  }

  async getNextTrip(caretakerProfileId: string): Promise<CaretakerNextTrip | null> {
    const now = new Date();

    const booking = await bookingDB
      .findOne({
        caretakerId: caretakerProfileId,
        status: { $in: ["CONFIRMED", "COMPLETED"] },
        startDate: { $gte: now },
      })
      .sort({ startDate: 1 })
      .lean()
      .exec();

    if (!booking) {
      return null;
    }

    const [pkg, client] = await Promise.all([
      packageDB.findById(booking.packageId).lean().exec(),
      userDB.findById(booking.clientId).lean().exec(),
    ]);

    const packageName =
      (pkg as { PackageName?: string } | null)?.PackageName ?? "Trip";

    let clientName: string | undefined;
    if (client) {
      const c = client as {
        firstName?: string;
        lastName?: string;
        email?: string;
      };
      const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
      clientName = fullName || c.email || "Client";
    } else {
      clientName = "Client";
    }

    const packageEndDate =
      (pkg as { endDate?: Date } | null)?.endDate ?? booking.startDate;

    return {
      bookingId: booking._id.toString(),
      packageName,
      clientName,
      startDate: booking.startDate,
      endDate: packageEndDate,
      status: booking.status,
    };
  }
}

