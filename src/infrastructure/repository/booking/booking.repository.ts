import { injectable } from "tsyringe";
import { IBookingEntity } from "../../../domain/entities/booking.entity";
import { IBookingRepository } from "../../../domain/repositoryInterfaces/Booking/booking.repository.interface";
import { bookingDB } from "../../database/models/booking.model";
import { IBookingModel } from "../../database/schemas/booking.schema";
import { BaseRepository } from "../baseRepository";
import { BookingMapper } from "../../../application/mapper/booking.mapper";

@injectable()
export class BookingRepository
  extends BaseRepository<IBookingModel, IBookingEntity>
  implements IBookingRepository
{
  constructor() {
    super(bookingDB, BookingMapper.toEntity);
  }

  async findByStripeSessionId(sessionId: string): Promise<IBookingEntity | null> {
    const doc = await bookingDB.findOne({ stripeSessionId: sessionId }).exec();
    if (!doc) return null;
    return BookingMapper.toEntity(doc);
  }

  async findByPackageId(packageId: string): Promise<IBookingEntity[]> {
    const docs = await bookingDB.find({ packageId }).exec();
    return docs.map((doc) => BookingMapper.toEntity(doc));
  }
}
