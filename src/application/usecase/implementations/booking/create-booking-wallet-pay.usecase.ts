import { inject, injectable } from "tsyringe";
import type { ClientSession } from "mongoose";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { CustomError } from "../../../../domain/errors/customError";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
} from "../../../../shared/constants/constants";
import type { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import type { IAgencySpecialNeedsRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import type { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import type { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import type { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import type { IDBSession } from "../../../../infrastructure/interface/session.interface";
import type { IDebitWalletUseCase } from "../../interfaces/wallet/debit-wallet.interface";
import type { ICreditBookingPayoutUseCase } from "../../interfaces/wallet/credit-booking-payout.interface";
import type { IChatConversationProvisioner } from "../../../services/chat/chat-conversation-provisioner";
import { NotificationService } from "../../../services/notification/notification.service";
import { generateBookingId } from "../../../../shared/utils/booking-id";
import type {
  CreateBookingWalletPayResult,
  ICreateBookingWalletPayUseCase,
} from "../../interfaces/booking/create-booking-wallet-pay.interface";

@injectable()
export class CreateBookingWalletPayUseCase implements ICreateBookingWalletPayUseCase {
  constructor(
    @inject("IPackageRepository")
    private readonly _packageRepository: IPackageRepository,
    @inject("IAgencySpecialNeedsRepository")
    private readonly _agencySpecialNeedsRepository: IAgencySpecialNeedsRepository,
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("IDBSession")
    private readonly _dbSession: IDBSession,
    @inject("IDebitWalletUseCase")
    private readonly _debitWalletUseCase: IDebitWalletUseCase,
    @inject("ICreditBookingPayoutUseCase")
    private readonly _creditBookingPayoutUseCase: ICreditBookingPayoutUseCase,
    @inject("IChatConversationProvisioner")
    private readonly _chatConversationProvisioner: IChatConversationProvisioner,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
  ) {}

  async execute(
    clientId: string,
    data: { packageId: string; caretakerId?: string; specialNeedIds?: string[] }
  ): Promise<CreateBookingWalletPayResult> {
    const pkg = await this._packageRepository.findById(data.packageId);
    if (!pkg) throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    if (pkg.status !== "published") {
      throw new ValidationError(ERROR_MESSAGE.BOOKING.ONLY_PUBLISHED_CAN_BE_BOOKED);
    }

    // Prevent overlapping confirmed bookings
    const bookings = await this._bookingRepository.findByClientId(clientId);
    const activeBookings = bookings.filter((b) => b.status === "CONFIRMED");
    const packageIds = activeBookings.map((b) => b.packageId);
    const conflicting = await this._packageRepository.findConflictingPackages(
      packageIds,
      pkg.startDate,
      pkg.endDate
    );
    if (conflicting.length > 0) {
      throw new CustomError(
        HTTP_STATUS.CONFLICT,
        ERROR_MESSAGE.BOOKING.ANOTHER_BOOKING_ON_THIS_DATE(conflicting[0].PackageName)
      );
    }

    const tripDays = this.getTripDays(pkg.startDate, pkg.endDate);
    const basePrice = pkg.basePrice;
    const selectedSpecialNeedIds = data.specialNeedIds ?? [];

    let caretakerFee = 0;
    let caretakerId: string | undefined;
    if (data.caretakerId) {
      const caretaker = await this._caretakerProfileRepository.findById(
        data.caretakerId
      );
      if (!caretaker) {
        throw new NotFoundError(ERROR_MESSAGE.BOOKING.CARETAKER_NOT_FOUND);
      }
      if (caretaker.agencyId !== pkg.agencyId) {
        throw new ValidationError("Caretaker does not belong to this package's agency");
      }
      if (caretaker.status !== "active") {
        throw new ValidationError(ERROR_MESSAGE.BOOKING.CARETAKER_NOT_ACTIVE);
      }
      if (caretaker.availabilityStatus !== "AVAILABLE" || caretaker.isDeleted) {
        throw new ValidationError(ERROR_MESSAGE.BOOKING.CARETAKER_NOT_AVAILABLE);
      }
      caretakerFee = (caretaker.pricePerDay ?? 0) * tripDays;
      caretakerId = caretaker._id;
    }

    let specialNeedsFee = 0;
    if (selectedSpecialNeedIds.length) {
      for (const specialNeedId of selectedSpecialNeedIds) {
        const agencyNeed =
          await this._agencySpecialNeedsRepository.findByAgencyIdAndSpecialNeedId(
            pkg.agencyId,
            specialNeedId
          );
        if (agencyNeed && agencyNeed.isActive && !agencyNeed.isDeleted) {
          specialNeedsFee +=
            agencyNeed.unit === "per_day"
              ? agencyNeed.price * tripDays
              : agencyNeed.price;
        }
      }
    }

    const totalAmount = basePrice + caretakerFee + specialNeedsFee;
    if (totalAmount <= 0) {
      throw new ValidationError(ERROR_MESSAGE.BOOKING.TOTAL_AMOUNT_MUST_BE_GREATER_THAN_ZERO);
    }

    let createdBookingId: string | null = null;

    await this._dbSession.withTransaction(async () => {
      const session = this._dbSession.getSession() as ClientSession;

      // Create booking first to have a stable reference id.
      let created = null as Awaited<ReturnType<typeof this._bookingRepository.save>> | null;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          created = await this._bookingRepository.save(
            {
              bookingId: generateBookingId(),
              clientId,
              packageId: pkg._id,
              agencyId: pkg.agencyId,
              startDate: pkg.startDate,
              basePrice,
              caretakerFee,
              specialNeedsFee,
              totalAmount,
              currency: "inr",
              status: "CONFIRMED",
              paidAt: new Date(),
              caretakerId,
              selectedSpecialNeedIds: selectedSpecialNeedIds.length
                ? selectedSpecialNeedIds
                : undefined,
            },
            session
          );
          break;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const code = (err as { code?: number })?.code;
          const isDuplicateKey = code === 11000 || msg.toLowerCase().includes("e11000");
          if (!isDuplicateKey || attempt === 4) throw err;
        }
      }
      if (!created) return;
      createdBookingId = created._id;

      await this._debitWalletUseCase.execute(
        {
          ownerId: clientId,
          ownerType: "USER",
          amount: totalAmount,
          source: "PAYMENT",
          referenceId: `BOOKING_CLIENT_DEBIT:${created._id}`,
          description: `Booking payment (wallet) for booking ${created._id}`,
        },
        session
      );

      if (caretakerId) {
        await this._caretakerProfileRepository.updateAvailabilityStatus(
          caretakerId,
          "BUSY"
        );
      }

      await this._creditBookingPayoutUseCase.execute(
        {
          bookingId: created._id,
          agencyId: created.agencyId,
          totalAmount: created.totalAmount,
        },
        session
      );
    });

    if (!createdBookingId) {
      throw new CustomError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to create booking");
    }

    // Post-commit side effects.
    const booking = await this._bookingRepository.findById(createdBookingId);
    if (booking) {
      await this._chatConversationProvisioner.provisionForBooking(booking);

      const agency = await this._agencyRepository.findById(booking.agencyId);
      if (agency) {
        await this._notificationService.createAndPublish({
          recipientUserId: agency.userId,
          recipientRole: "agency_owner",
          type: "BOOKING_CONFIRMED",
          title: "New booking confirmed",
          message: "A booking has been confirmed and paid via wallet.",
          link: "/agency/packages",
          metadata: { type: "BOOKING_CONFIRMED", bookingId: booking._id },
        });
      }

      await this._notificationService.createAndPublish({
        recipientUserId: booking.clientId,
        recipientRole: "client",
        type: "BOOKING_CONFIRMED",
        title: "Booking confirmed",
        message: "Your wallet payment was successful and the booking is confirmed.",
        link: `/client/bookings/${booking._id}`,
        metadata: { type: "BOOKING_CONFIRMED", bookingId: booking._id },
      });
    }

    return { bookingId: createdBookingId };
  }

  private getTripDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}

