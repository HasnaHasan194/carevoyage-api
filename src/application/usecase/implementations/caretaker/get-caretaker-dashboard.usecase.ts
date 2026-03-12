import { inject, injectable } from "tsyringe";
import type { IGetCaretakerDashboardUseCase } from "../../interfaces/caretaker/get-caretaker-dashboard.interface";
import type { CaretakerDashboardResponseDTO } from "../../../dto/response/caretaker-dashboard-response.dto";
import type { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import type { ICaretakerDashboardRepository } from "../../../../domain/repositoryInterfaces/CaretakerDashboard/caretaker-dashboard.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class GetCaretakerDashboardUseCase implements IGetCaretakerDashboardUseCase {
  constructor(
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("ICaretakerDashboardRepository")
    private readonly _dashboardRepository: ICaretakerDashboardRepository
  ) {}

  async execute(userId: string): Promise<CaretakerDashboardResponseDTO> {
    const profile = await this._caretakerProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError(ERROR_MESSAGE.CARETAKER.PROFILE_NOT_FOUND);
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
    }

    const [stats, nextTrip] = await Promise.all([
      this._dashboardRepository.getDashboardStats(profile._id),
      this._dashboardRepository.getNextTrip(profile._id),
    ]);

    const verificationStatus =
      profile.verificationStatus === "pending" ||
      profile.verificationStatus === "verified" ||
      profile.verificationStatus === "rejected"
        ? profile.verificationStatus
        : "pending";

    const availabilityStatus =
      profile.availabilityStatus === "AVAILABLE" ||
      profile.availabilityStatus === "BUSY" ||
      profile.availabilityStatus === "INACTIVE"
        ? profile.availabilityStatus
        : "INACTIVE";

    return {
      basicInfo: {
        caretakerId: profile._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage,
        verificationStatus,
        availabilityStatus,
      },
      dailyWage: profile.pricePerDay ?? 0,
      income: {
        totalIncome: stats.totalIncome,
        weeklyIncome: stats.weeklyIncome,
        monthlyIncome: stats.monthlyIncome,
        yearlyIncome: stats.yearlyIncome,
      },
      totalTrips: stats.totalTrips,
      upcomingTripsCount: stats.upcomingTripsCount,
      completedTripsCount: stats.completedTripsCount,
      nextTrip: nextTrip
        ? {
            bookingId: nextTrip.bookingId,
            packageName: nextTrip.packageName,
            clientName: nextTrip.clientName,
            startDate: nextTrip.startDate.toISOString(),
            endDate: nextTrip.endDate.toISOString(),
            status: nextTrip.status,
          }
        : null,
    };
  }
}
