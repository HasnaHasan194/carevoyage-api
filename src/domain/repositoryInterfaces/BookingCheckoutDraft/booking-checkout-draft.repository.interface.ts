import { IBookingCheckoutDraftEntity } from "../../entities/booking-checkout-draft.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IBookingCheckoutDraftRepository
  extends IBaseRepository<IBookingCheckoutDraftEntity> {
  findByStripeSessionId(
    sessionId: string,
  ): Promise<IBookingCheckoutDraftEntity | null>;
}

