import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IAgencySpecialNeedsRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IPaymentService } from "../../../../domain/service-interfaces/payment-service.interface";
import {
  ICreateBookingCheckoutUseCase,
  CreateBookingCheckoutResult,
} from "../../interfaces/booking/create-booking-checkout.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { config } from "../../../../shared/config";

@injectable()
export class CreateBookingCheckoutUseCase implements ICreateBookingCheckoutUseCase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IAgencySpecialNeedsRepository")
    private _agencySpecialNeedsRepository: IAgencySpecialNeedsRepository,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IPaymentService")
    private _paymentService: IPaymentService
  ) {}

  async execute(
    clientId: string,
    data: {
      packageId: string;
      caretakerFee?: number;
      specialNeedIds?: string[];
    }
  ): Promise<CreateBookingCheckoutResult> {
    const pkg = await this._packageRepository.findById(data.packageId);
    if (!pkg) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }
    if (pkg.status !== "published") {
      throw new ValidationError(
        "Only published packages can be booked"
      );
    }

    const tripDays = this.getTripDays(pkg.startDate, pkg.endDate);
    const basePrice = pkg.basePrice;
    const caretakerFee = data.caretakerFee ?? 0;
    let specialNeedsFee = 0;

    if (data.specialNeedIds?.length) {
      for (const specialNeedId of data.specialNeedIds) {
        const agencyNeed =
          await this._agencySpecialNeedsRepository.findByAgencyIdAndSpecialNeedId(
            pkg.agencyId,
            specialNeedId
          );
        if (
          agencyNeed &&
          agencyNeed.isActive &&
          !agencyNeed.isDeleted
        ) {
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
      throw new ValidationError("Total amount must be greater than 0");
    }

    const booking = await this._bookingRepository.save({
      clientId,
      packageId: pkg._id,
      agencyId: pkg.agencyId,
      basePrice,
      caretakerFee,
      specialNeedsFee,
      totalAmount,
      currency: "inr",
      status: "pending_payment",
    });

    const baseUrl = config.client.URI || "http://localhost:5173";
    const successUrl = `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/booking/cancel`;

    const { url, sessionId } = await this._paymentService.createCheckoutSession(
      totalAmount,
      "inr",
      successUrl,
      cancelUrl,
      { bookingId: booking._id },
      {
        name: pkg.PackageName,
        description: pkg.description,
        images: pkg.images?.length ? pkg.images : undefined,
      }
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
