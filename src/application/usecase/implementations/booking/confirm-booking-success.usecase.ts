import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IDBSession } from "../../../../infrastructure/interface/session.interface";
import { IConfirmBookingSuccessUseCase } from "../../interfaces/booking/confirm-booking-success.interface";
import type { ICreditBookingPayoutUseCase } from "../../interfaces/wallet/credit-booking-payout.interface";

@injectable()
export class ConfirmBookingSuccessUseCase implements IConfirmBookingSuccessUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IDBSession")
    private _dbSession: IDBSession,
    @inject("ICreditBookingPayoutUseCase")
    private _creditBookingPayoutUseCase: ICreditBookingPayoutUseCase
  ) {}

  async execute(sessionId: string): Promise<void> {
    const booking = await this._bookingRepository.findByStripeSessionId(sessionId);
    if (!booking) return;
    if (booking.status !== "pending_payment") return;

    await this._dbSession.withTransaction(async () => {
      const session = this._dbSession.getSession();

      await this._bookingRepository.updateById(
        booking._id,
        {
          status: "CONFIRMED",
          paidAt: new Date(),
        },
        session
      );

      if (booking.caretakerId) {
        await this._caretakerProfileRepository.updateAvailabilityStatus(
          booking.caretakerId,
          "BUSY"
        );
      }

      await this._creditBookingPayoutUseCase.execute(
        {
          bookingId: booking._id,
          agencyId: booking.agencyId,
          totalAmount: booking.totalAmount,
        },
        session
      );
    });
  }
}
