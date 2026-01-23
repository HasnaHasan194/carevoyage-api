import { AgencyMapper } from "../../../application/mapper/agency.mapper";
import { IAgencyEntity } from "../../../domain/entities/Agency.entity";
import { IAgencyModel, agencyDB } from "../../database/models/agency.model";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { BaseRepository } from "../baseRepository";
import { SortOrder } from "mongoose";
import { userDB } from "../../database/models/client.model";

export class AgencyRepository
  extends BaseRepository<IAgencyModel, IAgencyEntity>
  implements IAgencyRepository
{
  constructor() {
    super(agencyDB, AgencyMapper.toEntity);
  }

  async findByUserId(userId: string): Promise<IAgencyEntity | null> {
    const doc = await agencyDB.findOne({ userId }).exec();
    return doc ? AgencyMapper.toEntity(doc) : null;
  }

  async updateVerificationStatus(
    agencyId: string,
    status: "pending" | "verified" | "rejected"
  ): Promise<IAgencyEntity | null> {
    const doc = await agencyDB
      .findByIdAndUpdate(
        agencyId,
        { $set: { verificationStatus: status } },
        { new: true }
      )
      .exec();

    return doc ? AgencyMapper.toEntity(doc) : null;
  }

  async updateBlockStatus(
    agencyId: string,
    isBlocked: boolean
  ): Promise<boolean> {
    const result = await agencyDB.updateOne(
      { _id: agencyId },
      { $set: { isBlocked } }
    );

    return result.modifiedCount === 1;
  }

  async findByRegistrationNumber(
    registrationNumber: string
  ): Promise<IAgencyEntity | null> {
    const doc = await agencyDB.findOne({ registrationNumber }).exec();

    return doc ? AgencyMapper.toEntity(doc) : null;
  }

  async findAllWithSearch(
    page: number,
    limit: number,
    search?: string,
    status: "all" | "blocked" | "unblocked" = "all",
    sort: string = "createdAt",
    order: "asc" | "desc" = "asc"
  ): Promise<{ agencies: IAgencyEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const matchConditions: Record<string, unknown> = {};

    // Apply status filter
    if (status === "blocked") {
      matchConditions.isBlocked = true;
    } else if (status === "unblocked") {
      matchConditions.isBlocked = false;
    }
    // If status is "all", no filter is applied

    // Apply search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      
      // First, find user IDs that match the search (by email)
      const matchingUsers = await userDB
        .find({
          role: "agency_owner",
          $or: [
            { email: searchRegex },
            { firstName: searchRegex },
            { lastName: searchRegex },
          ],
        })
        .select("_id")
        .exec();

      const matchingUserIds = matchingUsers.map((user) => user._id);

      // Search in agency fields or by userId
      matchConditions.$or = [
        { agencyName: searchRegex },
        { registrationNumber: searchRegex },
        { address: searchRegex },
        ...(matchingUserIds.length > 0 ? [{ userId: { $in: matchingUserIds } }] : []),
      ];
    }

    // Build sort object
    const sortField = sort || "createdAt";
    const sortOrder: SortOrder = order === "desc" ? -1 : 1;
    const sortObject: Record<string, SortOrder> = {
      [sortField]: sortOrder,
    };

    const [agencies, total] = await Promise.all([
      agencyDB
        .find(matchConditions)
        .skip(skip)
        .limit(limit)
        .sort(sortObject)
        .exec(),
      agencyDB.countDocuments(matchConditions),
    ]);

    return {
      agencies: agencies.map((agency) => AgencyMapper.toEntity(agency)),
      total,
    };
  }
}
