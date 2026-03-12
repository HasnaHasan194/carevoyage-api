import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IAgencySpecialNeedsRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import {
  ICreateBookingCheckoutUseCase,
  CreateBookingCheckoutResult,
} from "../../interfaces/booking/create-booking-checkout.interface";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
} from "../../../../shared/constants/constants";
import { config } from "../../../../shared/config";
import { IPackageEntity } from "../../../../domain/entities/package.entity";
import { CustomError } from "../../../../domain/errors/customError";
import type { IChatConversationProvisioner } from "../../../services/chat/chat-conversation-provisioner";

@injectable()
export class CreateBookingCheckoutUseCase implements ICreateBookingCheckoutUseCase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IAgencySpecialNeedsRepository")
    private _agencySpecialNeedsRepository: IAgencySpecialNeedsRepository,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IPaymentService")
    private _paymentService: IPaymentService,
    @inject("IChatConversationProvisioner")
    private readonly _chatConversationProvisioner: IChatConversationProvisioner,
  ) {}

  async execute(
    clientId: string,
    data: {
      packageId: string;
      caretakerFee?: number;
      caretakerId?: string;
      specialNeedIds?: string[];
    },
  ): Promise<CreateBookingCheckoutResult> {
    const pkg = await this._packageRepository.findById(data.packageId);
    if (!pkg) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }
    if (pkg.status !== "published") {
      throw new ValidationError(ERROR_MESSAGE.BOOKING.ONLY_PUBLISHED_CAN_BE_BOOKED);
    }

   
   

    const bookings = await this._bookingRepository.findByClientId(clientId);

    const activeBookings = bookings.filter(
      (b) => b.status === "CONFIRMED" || b.status === "pending_payment",
    );

    const packageIds = activeBookings.map((bkg) => bkg.packageId);

    const conflictingPackages =
      await this._packageRepository.findConflictingPackages(
        packageIds,
        pkg.startDate,
        pkg.endDate,
      );

    if (conflictingPackages.length > 0) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.BOOKING.ANOTHER_BOOKING_ON_THIS_DATE(
          conflictingPackages[0].PackageName,
        ),
      );
    }

    const tripDays = this.getTripDays(pkg.startDate, pkg.endDate);
    const basePrice = pkg.basePrice;
    let caretakerFee = data.caretakerFee ?? 0;
    let caretakerId: string | undefined;
    const selectedSpecialNeedIds = data.specialNeedIds ?? [];

    if (data.caretakerId) {
      const caretaker = await this._caretakerProfileRepository.findById(
        data.caretakerId,
      );
      if (!caretaker) {
        throw new NotFoundError(ERROR_MESSAGE.BOOKING.CARETAKER_NOT_FOUND);
      }
      if (caretaker.agencyId !== pkg.agencyId) {
        throw new ValidationError(
          "Caretaker does not belong to this package's agency",
        );
      }
      if (caretaker.status !== "active") {
        throw new ValidationError(ERROR_MESSAGE.BOOKING.CARETAKER_NOT_ACTIVE);
      }
      if (caretaker.availabilityStatus !== "AVAILABLE" || caretaker.isDeleted) {
        throw new ValidationError(ERROR_MESSAGE.BOOKING.CARETAKER_NOT_AVAILABLE);
      }
      const pricePerDay = caretaker.pricePerDay ?? 0;
      caretakerFee = pricePerDay * tripDays;
      caretakerId = caretaker._id;
    }

    let specialNeedsFee = 0;

    if (selectedSpecialNeedIds.length) {
      for (const specialNeedId of selectedSpecialNeedIds) {
        const agencyNeed =
          await this._agencySpecialNeedsRepository.findByAgencyIdAndSpecialNeedId(
            pkg.agencyId,
            specialNeedId,
          );
        if (agencyNeed && agencyNeed.isActive && !agencyNeed.isDeleted) {
          if (agencyNeed.unit === "per_day") {
            specialNeedsFee += agencyNeed.price * tripDays;
          } else {
            specialNeedsFee += agencyNeed.price;
          }
        }
      }
    }

    const totalAmount = basePrice + caretakerFee + specialNeedsFee;
    if (totalAmount <= 0) {
      throw new ValidationError(
        ERROR_MESSAGE.BOOKING.TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO,
      );
    }
    

   

    const booking = await this._bookingRepository.save({
      clientId,
      packageId: pkg._id,
      agencyId: pkg.agencyId,
      startDate: pkg.startDate,
      basePrice,
      caretakerFee,
      specialNeedsFee,
      totalAmount,
      currency: "inr",
      status: "pending_payment",
      caretakerId,
      selectedSpecialNeedIds: selectedSpecialNeedIds.length
        ? selectedSpecialNeedIds
        : undefined,
    });

    await this._chatConversationProvisioner.provisionForBooking(booking);

    const baseUrl = config.client.URI || "http://localhost:5173";
    const successUrl = `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/booking/cancel`;

    const { url, sessionId } = await this._paymentService.createCheckoutSession(
      totalAmount,
      "inr",
      successUrl,
      cancelUrl,
      { bookingId: String(booking._id) },
      {
        name: pkg.PackageName,
        description: pkg.description,
        images: pkg.images?.length ? pkg.images : undefined,
      },
    );

    await this._bookingRepository.updateById(booking._id, {
      stripeSessionId: sessionId,
    });

    return { url, sessionId, bookingId: booking._id };
  }

  private getTripDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}
