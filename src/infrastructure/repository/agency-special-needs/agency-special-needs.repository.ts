import { injectable } from "tsyringe";
import { AgencySpecialNeedsMapper } from "../../../application/mapper/agency-special-needs.mapper";
import { IAgencySpecialNeedsEntity } from "../../../domain/entities/agency-special-needs.entity";
import { IAgencySpecialNeedsRepository } from "../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { agencySpecialNeedsDB } from "../../database/models/agency-special-needs.model";
import { IAgencySpecialNeedsModel } from "../../database/models/interfaces/agency-special-needs.model.interface";
import { BaseRepository } from "../baseRepository";

@injectable()
export class AgencySpecialNeedsRepository
  extends BaseRepository<IAgencySpecialNeedsModel, IAgencySpecialNeedsEntity>
  implements IAgencySpecialNeedsRepository
{
  constructor() {
    super(agencySpecialNeedsDB, AgencySpecialNeedsMapper.toEntity);
  }

  async findByAgencyId(
    agencyId: string,
    includeDeleted: boolean = false
  ): Promise<IAgencySpecialNeedsEntity[]> {
    const query: any = { agencyId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const docs = await agencySpecialNeedsDB
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => AgencySpecialNeedsMapper.toEntity(doc));
  }

  async findByIdAndAgencyId(
    id: string,
    agencyId: string
  ): Promise<IAgencySpecialNeedsEntity | null> {
    const doc = await agencySpecialNeedsDB
      .findOne({ _id: id, agencyId })
      .exec();
    if (!doc) return null;
    return AgencySpecialNeedsMapper.toEntity(doc);
  }

  async findByAgencyIdAndSpecialNeedId(
    agencyId: string,
    specialNeedId: string
  ): Promise<IAgencySpecialNeedsEntity | null> {
    const doc = await agencySpecialNeedsDB
      .findOne({ agencyId, specialNeedId })
      .exec();
    if (!doc) return null;
    return AgencySpecialNeedsMapper.toEntity(doc);
  }

  async softDelete(
    id: string,
    agencyId: string
  ): Promise<IAgencySpecialNeedsEntity | null> {
    const doc = await agencySpecialNeedsDB
      .findOneAndUpdate(
        { _id: id, agencyId },
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      )
      .exec();
    if (!doc) return null;
    return AgencySpecialNeedsMapper.toEntity(doc);
  }
}
