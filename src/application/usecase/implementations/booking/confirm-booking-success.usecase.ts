import { inject, injectable } from "tsyringe";
import { IBookingRepository } from "../../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { IBookingCheckoutDraftRepository } from "../../../../domain/repositoryInterfaces/BookingCheckoutDraft/booking-checkout-draft.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IDBSession } from "../../../../infrastructure/interface/session.interface";
import { IConfirmBookingSuccessUseCase } from "../../interfaces/booking/confirm-booking-success.interface";
import type { ICreditBookingPayoutUseCase } from "../../interfaces/wallet/credit-booking-payout.interface";
import type { IChatConversationProvisioner } from "../../../services/chat/chat-conversation-provisioner";
import { NotificationService } from "../../../services/notification/notification.service";
import { finalizeBookingFromCheckoutDraft } from "../../../services/booking/booking-checkout-finalizer";

@injectable()
export class ConfirmBookingSuccessUseCase implements IConfirmBookingSuccessUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("IBookingCheckoutDraftRepository")
    private _bookingCheckoutDraftRepository: IBookingCheckoutDraftRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository,
    @inject("IDBSession")
    private _dbSession: IDBSession,
    @inject("ICreditBookingPayoutUseCase")
    private _creditBookingPayoutUseCase: ICreditBookingPayoutUseCase,
    @inject("IChatConversationProvisioner")
    private readonly _chatConversationProvisioner: IChatConversationProvisioner,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
  ) {}

  async execute(sessionId: string): Promise<void> {
    await finalizeBookingFromCheckoutDraft({
      stripeSessionId: sessionId,
      bookingCheckoutDraftRepository: this._bookingCheckoutDraftRepository,
      bookingRepository: this._bookingRepository,
      caretakerProfileRepository: this._caretakerProfileRepository,
      agencyRepository: this._agencyRepository,
      dbSession: this._dbSession,
      creditBookingPayoutUseCase: this._creditBookingPayoutUseCase,
      chatConversationProvisioner: this._chatConversationProvisioner,
      notificationService: this._notificationService,
    });
  }
}
