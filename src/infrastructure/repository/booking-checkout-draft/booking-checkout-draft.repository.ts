import { injectable } from "tsyringe";
import { BaseRepository } from "../baseRepository";
import { BookingCheckoutDraftMapper } from "../../../application/mapper/booking-checkout-draft.mapper";
import { IBookingCheckoutDraftEntity } from "../../../domain/entities/booking-checkout-draft.entity";
import { IBookingCheckoutDraftRepository } from "../../../domain/repositoryInterfaces/BookingCheckoutDraft/booking-checkout-draft.repository.interface";
import {
  bookingCheckoutDraftDB,
} from "../../database/models/booking-checkout-draft.model";
import { IBookingCheckoutDraftModel } from "../../database/schemas/booking-checkout-draft.schema";

@injectable()
export class BookingCheckoutDraftRepository
  extends BaseRepository<IBookingCheckoutDraftModel, IBookingCheckoutDraftEntity>
  implements IBookingCheckoutDraftRepository
{
  constructor() {
    super(bookingCheckoutDraftDB, BookingCheckoutDraftMapper.toEntity);
  }

  async findByStripeSessionId(
    sessionId: string,
  ): Promise<IBookingCheckoutDraftEntity | null> {
    const doc = await bookingCheckoutDraftDB
      .findOne({ stripeSessionId: sessionId })
      .exec();
    if (!doc) return null;
    return BookingCheckoutDraftMapper.toEntity(doc);
  }
}

