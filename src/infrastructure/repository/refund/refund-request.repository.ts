import { injectable } from "tsyringe";
import { IRefundRequestEntity } from "../../../domain/entities/refund-request.entity";
import { IRefundRequestRepository } from "../../../domain/repositoryInterfaces/Refund/refund-request.repository.interface";
import { refundRequestDB } from "../../database/models/refund-request.model";
import { IRefundRequestModel } from "../../database/schemas/refund-request.schema";
import { BaseRepository } from "../baseRepository";

@injectable()
export class RefundRequestRepository
  extends BaseRepository<IRefundRequestModel, IRefundRequestEntity>
  implements IRefundRequestRepository
{
  constructor() {
    super(refundRequestDB, (doc) => ({
      _id: String(doc._id),
      bookingId: String(doc.bookingId),
      userId: String(doc.userId),
      agencyId: String(doc.agencyId),
      refundAmount: doc.refundAmount,
      status: doc.status,
      reason: doc.reason ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findByBookingId(bookingId: string): Promise<IRefundRequestEntity | null> {
    const doc = await refundRequestDB.findOne({ bookingId }).exec();
    if (!doc) return null;
    return {
      _id: String(doc._id),
      bookingId: String(doc.bookingId),
      userId: String(doc.userId),
      agencyId: String(doc.agencyId),
      refundAmount: doc.refundAmount,
      status: doc.status,
      reason: doc.reason ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByAgencyId(agencyId: string): Promise<IRefundRequestEntity[]> {
    const docs = await refundRequestDB
      .find({ agencyId })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => ({
      _id: String(doc._id),
      bookingId: String(doc.bookingId),
      userId: String(doc.userId),
      agencyId: String(doc.agencyId),
      refundAmount: doc.refundAmount,
      status: doc.status,
      reason: doc.reason ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findByAgencyIdPaginated(
    agencyId: string,
    page: number,
    limit: number
  ): Promise<IRefundRequestEntity[]> {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    const docs = await refundRequestDB
      .find({ agencyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .exec();

    return docs.map((doc) => ({
      _id: String(doc._id),
      bookingId: String(doc.bookingId),
      userId: String(doc.userId),
      agencyId: String(doc.agencyId),
      refundAmount: doc.refundAmount,
      status: doc.status,
      reason: doc.reason ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async countByAgencyId(agencyId: string): Promise<number> {
    return refundRequestDB.countDocuments({ agencyId }).exec();
  }
}

