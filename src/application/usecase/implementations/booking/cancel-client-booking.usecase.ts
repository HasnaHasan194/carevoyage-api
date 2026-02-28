import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { type ICancelClientBookingUseCase } from "../../interfaces/booking/cancel-client-booking.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";

@injectable()
export class CancelClientBookingUseCase implements ICancelClientBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private readonly _bookingRepository: IBookingRepository,

    @inject("ICaretakerProfileRepository")
    private readonly _caretakerProfileRepository: ICaretakerProfileRepository,
  ) {}

  async execute(
    clientId: string,
    bookingId: string,
    reason?: string
  ): Promise<void> {
    const booking = await this._bookingRepository.findByIdAndClientId(
      bookingId,
      clientId,
    );
    if (!booking) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING.NOT_FOUND);
    }

    if (booking.status !== "CONFIRMED") {
      throw new ValidationError(ERROR_MESSAGE.BOOKING.CANNOT_CANCEL);
    }

    await this._bookingRepository.updateById(bookingId, {
      status: "CANCELLED_BY_USER",
      cancellationReason: reason?.trim() || undefined,
    });

    if (booking.caretakerId) {
      await this._caretakerProfileRepository.updateAvailabilityStatus(
        booking.caretakerId,
        "AVAILABLE",
      );
    }
  }
}
