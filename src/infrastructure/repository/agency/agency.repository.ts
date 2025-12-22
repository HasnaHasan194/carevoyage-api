import { AgencyMapper } from "../../../application/mapper/agency.mapper";
import { IAgencyEntity } from "../../../domain/entities/Agency.entity";
import { IAgencyModel, agencyDB } from "../../database/models/agency.model";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";

import { BaseRepository } from "../baseRepository";

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
}
