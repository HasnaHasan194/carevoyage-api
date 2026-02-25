import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IConfirmBookingSuccessUseCase } from "../../interfaces/booking/confirm-booking-success.interface";

@injectable()
export class ConfirmBookingSuccessUseCase implements IConfirmBookingSuccessUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository
  ) {}

  async execute(sessionId: string): Promise<void> {
    const booking = await this._bookingRepository.findByStripeSessionId(sessionId);
    if (!booking) return;
    if (booking.status !== "pending_payment") return;

    await this._bookingRepository.updateById(booking._id, {
      status: "paid",
      paidAt: new Date(),
    });

    if (booking.caretakerId) {
      await this._caretakerProfileRepository.updateAvailabilityStatus(
        booking.caretakerId,
        "BUSY"
      );
    }
  }
}
