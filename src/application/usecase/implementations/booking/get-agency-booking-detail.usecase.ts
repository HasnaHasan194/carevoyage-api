import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import type { IGetAgencyBookingDetailUseCase } from "../../interfaces/booking/get-agency-booking-detail.interface";
import type { AgencyBookingDetailDTO } from "../../../dto/response/agency-booking-response.dto";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

function mapStatusToLabel(status: string): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";
    case "CANCELLED_BY_USER":
      return "Cancelled by client";
    case "REFUNDED":
      return "Refunded";
    case "pending_payment":
      return "Pending payment";
    default:
      return status;
  }
}

@injectable()
export class GetAgencyBookingDetailUseCase
  implements IGetAgencyBookingDetailUseCase
{
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository,
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(
    agencyId: string,
    bookingId: string
  ): Promise<AgencyBookingDetailDTO> {
    const booking = await this._bookingRepository.findByIdAndAgencyId(
      bookingId,
      agencyId
    );

    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING.NOT_FOUND);
    }

    const pkg = await this._packageRepository.findById(booking.packageId);
    const client = await this._userRepository.findById(booking.clientId);

    let caretakerName: string | undefined;
    let caretakerProfileImage: string | undefined;
    let caretakerVerificationStatus: string | undefined;

    if (booking.caretakerId) {
      const profile = await this._caretakerProfileRepository.findById(
        booking.caretakerId
      );
      if (profile) {
        caretakerProfileImage = profile.profileImage;
        caretakerVerificationStatus = profile.verificationStatus;
        caretakerName = profile.email ?? "Caretaker";
        if (profile.userId) {
          const user = await this._userRepository.findById(profile.userId);
          if (user) {
            const fullName = `${user.firstName} ${user.lastName}`.trim();
            if (fullName) caretakerName = fullName;
          }
        }
      }
    }

    let clientName: string | undefined;
    if (client) {
      const fullName = `${client.firstName} ${client.lastName}`.trim();
      clientName = fullName || client.email || undefined;
    }

    return {
      id: booking._id,
      bookingId: booking._id,
      packageId: booking.packageId,
      packageName: pkg?.PackageName ?? "Unknown package",
      clientId: booking.clientId,
      clientName,
      status: booking.status,
      statusLabel: mapStatusToLabel(booking.status),
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      startDate: pkg?.startDate,
      endDate: pkg?.endDate,
      createdAt: booking.createdAt,
      basePrice: booking.basePrice,
      caretakerFee: booking.caretakerFee,
      specialNeedsFee: booking.specialNeedsFee,
      specialNeedIds: booking.selectedSpecialNeedIds,
      caretakerName,
      caretakerProfileImage,
      caretakerVerificationStatus,
      packageDescription: pkg?.description,
      packageImages: pkg?.images,
      meetingPoint: pkg?.meetingPoint,
      cancellationReason: booking.cancellationReason,
    };
  }
}

