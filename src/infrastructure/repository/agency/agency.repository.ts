import mongoose from "mongoose";
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
    if (!userId || typeof userId !== "string") return null;
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      // Try querying with ObjectId first (normal case)
      let docs = await agencyDB.find({ userId: objectId }).exec();
      
      // If not found, try querying with string userId (for old/inconsistent data)
      if (docs.length === 0) {
        docs = await agencyDB.find({ userId: userId }).exec();
      }
      
      // Also try finding ALL agencies and filter manually to catch any format mismatches
      const allAgencies = await agencyDB.find({}).exec();
      const matchingAgencies = allAgencies.filter(agency => {
        const agencyUserId = agency.userId?.toString();
        return agencyUserId === userId || agencyUserId === objectId.toString();
      });
      
      // Use manual filter results if they found more matches
      if (matchingAgencies.length > docs.length) {
        docs = matchingAgencies;
      }
      
      if (docs.length === 0) {
        return null;
      }
      
      // If multiple agencies exist, prefer verified one, then most recent
      let selectedDoc = docs[0];
      if (docs.length > 1) {
        const verified = docs.find(d => d.verificationStatus === "verified");
        if (verified) {
          selectedDoc = verified;
        } else {
          // Sort by updatedAt descending, get most recent
          selectedDoc = docs.sort((a, b) => 
            (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)
          )[0];
        }
      }
      
      return AgencyMapper.toEntity(selectedDoc);
    } catch {
      return null;
    }
  }

  async updateVerificationStatus(
    agencyId: string,
    status: "pending" | "verified" | "rejected",
    rejectionReason?: string
  ): Promise<IAgencyEntity | null> {
    const update: Record<string, unknown> = {
      verificationStatus: status,
    };
    if (status === "rejected" && rejectionReason !== undefined) {
      update.rejectionReason = rejectionReason;
    } else if (status !== "rejected") {
      update.rejectionReason = null;
    }
    const doc = await agencyDB
      .findByIdAndUpdate(agencyId, { $set: update }, { new: true })
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
    verificationStatus: "all" | "pending" | "verified" | "rejected" = "all",
    sort: string = "createdAt",
    order: "asc" | "desc" = "asc"
  ): Promise<{ agencies: IAgencyEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const matchConditions: Record<string, unknown> = {};

    // Apply block status filter
    if (status === "blocked") {
      matchConditions.isBlocked = true;
    } else if (status === "unblocked") {
      matchConditions.isBlocked = false;
    }

    // Apply verification status filter
    if (verificationStatus !== "all") {
      matchConditions.verificationStatus = verificationStatus;
    }


    // Apply search filter
    if (search && search.trim()) {
      const trimmedSearch = search.trim();
      const searchRegex = new RegExp(trimmedSearch, "i");
      
      //  find user IDs that match the search (by email)
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

     
      const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const exactRegistrationNumberRegex = new RegExp(`^${escapedSearch}$`, "i");
      
      matchConditions.$or = [
        { registrationNumber: exactRegistrationNumberRegex }, // Exact match for registration number (prioritized)
        { agencyName: searchRegex },
        { address: searchRegex },
        { registrationNumber: searchRegex }, // Fallback partial match for registration number
        ...(matchingUserIds.length > 0 ? [{ userId: { $in: matchingUserIds } }] : []),
      ];
    }

    //  sort object
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
