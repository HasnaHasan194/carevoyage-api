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

  async findByStripeSessionId(
    sessionId: string,
  ): Promise<IBookingEntity | null> {
    const doc = await bookingDB.findOne({ stripeSessionId: sessionId }).exec();
    if (!doc) return null;
    return BookingMapper.toEntity(doc);
  }

  async findByPackageId(packageId: string): Promise<IBookingEntity[]> {
    const docs = await bookingDB.find({ packageId }).exec();
    return docs.map((doc) => BookingMapper.toEntity(doc));
  }

  async markConfirmedBookingsCompletedByPackageId(
    packageId: string,
  ): Promise<number> {
    const result = await bookingDB
      .updateMany(
        { packageId, status: "CONFIRMED" },
        { $set: { status: "COMPLETED" } },
      )
      .exec();
    return result.modifiedCount ?? 0;
  }

  async findByAgencyIdAndPackageId(
    agencyId: string,
    packageId: string,
  ): Promise<IBookingEntity[]> {
    const docs = await bookingDB
      .find({ agencyId, packageId })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => BookingMapper.toEntity(doc));
  }

  async findByClientId(clientId: string): Promise<IBookingEntity[]> {
    const docs = await bookingDB
      .find({ clientId })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => BookingMapper.toEntity(doc));
  }

  async findByIdAndClientId(
    bookingId: string,
    clientId: string,
  ): Promise<IBookingEntity | null> {
    const doc = await bookingDB.findOne({ _id: bookingId, clientId }).exec();
    if (!doc) return null;
    return BookingMapper.toEntity(doc);
  }

  async findByIdAndAgencyId(
    bookingId: string,
    agencyId: string,
  ): Promise<IBookingEntity | null> {
    const doc = await bookingDB.findOne({ _id: bookingId, agencyId }).exec();
    if (!doc) return null;
    return BookingMapper.toEntity(doc);
  }

  async findByCaretakerProfileIdPaginated(
    caretakerProfileId: string,
    page: number,
    limit: number,
  ): Promise<IBookingEntity[]> {
    const skip = (page - 1) * limit;

    const docs = await bookingDB
      .find({
        caretakerId: caretakerProfileId,
        status: { $in: ["CONFIRMED", "COMPLETED"] },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return docs.map((doc) => BookingMapper.toEntity(doc));
  }

  async countByCaretakerProfileId(caretakerProfileId: string): Promise<number> {
    const count = await bookingDB.countDocuments({
      caretakerId: caretakerProfileId,
      status: { $in: ["CONFIRMED", "COMPLETED"] },
    });
    return count;
  }
 
 
}

