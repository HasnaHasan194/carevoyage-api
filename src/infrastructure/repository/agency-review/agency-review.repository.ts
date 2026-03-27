import { injectable } from "tsyringe";
import mongoose from "mongoose";
import { IAgencyReviewEntity } from "../../../domain/entities/agency-review.entity";
import { IAgencyReviewRepository } from "../../../domain/repositoryInterfaces/AgencyReview/agency-review.repository.interface";
import { agencyReviewDB } from "../../database/models/agency-review.model";
import { AgencyReviewMapper } from "../../../application/mapper/agency-review.mapper";

@injectable()
export class AgencyReviewRepository implements IAgencyReviewRepository {
  async create(data: {
    bookingId: string;
    agencyId: string;
    packageId: string;
    clientId: string;
    rating: number;
    reviewText: string;
  }): Promise<IAgencyReviewEntity> {
    const doc = await agencyReviewDB.create({
      bookingId: new mongoose.Types.ObjectId(data.bookingId),
      agencyId: new mongoose.Types.ObjectId(data.agencyId),
      packageId: new mongoose.Types.ObjectId(data.packageId),
      clientId: new mongoose.Types.ObjectId(data.clientId),
      rating: data.rating,
      reviewText: data.reviewText,
    });
    return AgencyReviewMapper.toEntity(doc);
  }

  async findByBookingId(bookingId: string): Promise<IAgencyReviewEntity | null> {
    const doc = await agencyReviewDB
      .findOne({ bookingId: new mongoose.Types.ObjectId(bookingId) })
      .exec();
    if (!doc) return null;
    return AgencyReviewMapper.toEntity(doc);
  }

  async listAllByAgency(agencyId: string): Promise<IAgencyReviewEntity[]> {
    const oid = new mongoose.Types.ObjectId(agencyId);
    const docs = await agencyReviewDB
      .find({ agencyId: oid })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((d) => AgencyReviewMapper.toEntity(d));
  }

  async listByAgency(
    agencyId: string,
    page: number,
    limit: number
  ): Promise<{ items: IAgencyReviewEntity[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const oid = new mongoose.Types.ObjectId(agencyId);
    const [docs, totalItems] = await Promise.all([
      agencyReviewDB
        .find({ agencyId: oid })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      agencyReviewDB.countDocuments({ agencyId: oid }).exec(),
    ]);
    const items = docs.map((d) => AgencyReviewMapper.toEntity(d));
    return { items, totalItems };
  }

  async getSummaryByAgency(
    agencyId: string
  ): Promise<{ averageRating: number; totalReviews: number }> {
    const result = await agencyReviewDB
      .aggregate([
        { $match: { agencyId: new mongoose.Types.ObjectId(agencyId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ])
      .exec();
    if (!result.length) {
      return { averageRating: 0, totalReviews: 0 };
    }
    const { averageRating, totalReviews } = result[0];
    return {
      averageRating: Math.round((averageRating as number) * 10) / 10,
      totalReviews: totalReviews as number,
    };
  }
}
