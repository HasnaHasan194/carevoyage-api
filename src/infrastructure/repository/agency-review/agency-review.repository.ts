import { Types } from "mongoose";
import type { IAgencyReviewEntity } from "../../../domain/entities/agency-review.entity";
import type { IAgencyReviewRepository } from "../../../domain/repositoryInterfaces/AgencyReview/agency-review.repository.interface";
import { agencyReviewDB } from "../../database/models/agency-review.model";
import type { IAgencyReviewModel } from "../../database/schemas/agency-review.schema";
import { BaseRepository } from "../baseRepository";
import { AgencyReviewMapper } from "../../../application/mapper/agency-review.mapper";

export class AgencyReviewRepository
  extends BaseRepository<IAgencyReviewModel, IAgencyReviewEntity>
  implements IAgencyReviewRepository
{
  constructor() {
    super(agencyReviewDB, AgencyReviewMapper.toEntity);
  }

  async findByBookingId(bookingId: string): Promise<IAgencyReviewEntity | null> {
    const doc = await agencyReviewDB.findOne({ bookingId }).exec();
    return doc ? AgencyReviewMapper.toEntity(doc) : null;
  }

  async listByAgency(
    agencyId: string,
    page: number,
    limit: number
  ): Promise<{ reviews: IAgencyReviewEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const agencyObjectId = new Types.ObjectId(agencyId);

    const [docs, total] = await Promise.all([
      agencyReviewDB
        .find({ agencyId: agencyObjectId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      agencyReviewDB.countDocuments({ agencyId: agencyObjectId }).exec(),
    ]);

    return {
      reviews: docs.map((doc) => AgencyReviewMapper.toEntity(doc)),
      total,
    };
  }

  async getSummaryByAgency(agencyId: string): Promise<{ averageRating: number; count: number }> {
    const agencyObjectId = new Types.ObjectId(agencyId);

    const result = await agencyReviewDB
      .aggregate<{ _id: null; averageRating: number; count: number }>([
        { $match: { agencyId: agencyObjectId } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    if (!result.length) {
      return { averageRating: 0, count: 0 };
    }

    const row = result[0];
    return {
      averageRating: row.averageRating ?? 0,
      count: row.count ?? 0,
    };
  }
}

