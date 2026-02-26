import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import {
  type IGetClientBookingDetailUseCase,
} from "../../interfaces/booking/get-client-booking-detail.interface";
import type { ClientBookingDetailDTO } from "../../../dto/response/client-booking-response.dto";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

function mapStatusToLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Paid";
    case "pending_payment":
      return "Unpaid";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

@injectable()
export class GetClientBookingDetailUseCase
  implements IGetClientBookingDetailUseCase
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
    clientId: string,
    bookingId: string
  ): Promise<ClientBookingDetailDTO> {
    const booking = await this._bookingRepository.findByIdAndClientId(
      bookingId,
      clientId
    );
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING.NOT_FOUND);
    }

    const pkg = await this._packageRepository.findById(booking.packageId);

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

    const canCancel = booking.status === "pending_payment";

    return {
      id: booking._id,
      packageId: booking.packageId,
      packageName: pkg?.PackageName ?? "Unknown package",
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
      canCancel,
    };
  }
}

