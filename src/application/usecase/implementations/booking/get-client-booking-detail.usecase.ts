import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import {
  type IGetClientBookingDetailUseCase,
} from "../../interfaces/booking/get-client-booking-detail.interface";
import type {
  ClientBookingDetailDTO,
  PaymentBreakdownItemDTO,
  PaymentBreakdownFilter,
} from "../../../dto/response/client-booking-response.dto";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

function buildPaymentBreakdown(
  basePrice: number,
  caretakerFee: number,
  specialNeedsFee: number,
  paymentType: PaymentBreakdownFilter
): PaymentBreakdownItemDTO[] {
  const normalItem: PaymentBreakdownItemDTO = {
    type: "NORMAL",
    label: "Normal payment (package & caretaker)",
    amount: basePrice + caretakerFee,
    items: [
      { label: "Base package", amount: basePrice },
      { label: "Caretaker fee", amount: caretakerFee },
    ],
  };
  const specialItem: PaymentBreakdownItemDTO = {
    type: "SPECIAL_NEEDS",
    label: "Special needs payment",
    amount: specialNeedsFee,
    items: [{ label: "Special needs", amount: specialNeedsFee }],
  };
  if (paymentType === "normal") return [normalItem];
  if (paymentType === "special") return [specialItem];
  return [normalItem, specialItem];
}

function mapStatusToLabel(status: string): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";
    case "CANCELLED_BY_USER":
      return "Cancelled by you";
    case "REFUNDED":
      return "Refunded";
    case "pending_payment":
      return "Processing payment";
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
    bookingId: string,
    paymentType: PaymentBreakdownFilter = "all"
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

    const canCancel = booking.status === "CONFIRMED";

    const paymentBreakdown = buildPaymentBreakdown(
      booking.basePrice,
      booking.caretakerFee,
      booking.specialNeedsFee,
      paymentType
    );

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
      cancellationReason: booking.cancellationReason,
      paymentBreakdown,
    };
  }
}

