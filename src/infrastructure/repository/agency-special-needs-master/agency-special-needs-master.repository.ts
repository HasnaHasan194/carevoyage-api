import { injectable } from "tsyringe";
import { AgencySpecialNeedsMasterMapper } from "../../../application/mapper/agency-special-needs-master.mapper";
import { IAgencySpecialNeedsMasterEntity } from "../../../domain/entities/agency-special-needs-master.entity";
import { IAgencySpecialNeedsMasterRepository } from "../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { agencySpecialNeedsMasterDB } from "../../database/models/agency-special-needs-master.model";
import { IAgencySpecialNeedsMasterModel } from "../../database/models/interfaces/agency-special-needs-master.model.interface";
import { BaseRepository } from "../baseRepository";

@injectable()
export class AgencySpecialNeedsMasterRepository
  extends BaseRepository<IAgencySpecialNeedsMasterModel, IAgencySpecialNeedsMasterEntity>
  implements IAgencySpecialNeedsMasterRepository
{
  constructor() {
    super(agencySpecialNeedsMasterDB, AgencySpecialNeedsMasterMapper.toEntity);
  }

  async findByAgencyId(
    agencyId: string,
    includeDeleted: boolean = false
  ): Promise<IAgencySpecialNeedsMasterEntity[]> {
    const query: any = { agencyId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const docs = await agencySpecialNeedsMasterDB
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => AgencySpecialNeedsMasterMapper.toEntity(doc));
  }

  async findByAgencyIdPaginated(
    agencyId: string,
    includeDeleted: boolean,
    page: number,
    limit: number
  ): Promise<IAgencySpecialNeedsMasterEntity[]> {
    const query: Record<string, unknown> = { agencyId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    const docs = await agencySpecialNeedsMasterDB
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .exec();

    return docs.map((doc) => AgencySpecialNeedsMasterMapper.toEntity(doc));
  }

  async countByAgencyId(
    agencyId: string,
    includeDeleted: boolean
  ): Promise<number> {
    const query: Record<string, unknown> = { agencyId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }
    return agencySpecialNeedsMasterDB.countDocuments(query).exec();
  }

  async findActiveByAgencyId(
    agencyId: string
  ): Promise<IAgencySpecialNeedsMasterEntity[]> {
    const docs = await agencySpecialNeedsMasterDB
      .find({ agencyId, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => AgencySpecialNeedsMasterMapper.toEntity(doc));
  }

  async findByIdAndAgencyId(
    id: string,
    agencyId: string
  ): Promise<IAgencySpecialNeedsMasterEntity | null> {
    const doc = await agencySpecialNeedsMasterDB
      .findOne({ _id: id, agencyId })
      .exec();
    if (!doc) return null;
    return AgencySpecialNeedsMasterMapper.toEntity(doc);
  }

  async softDelete(
    id: string,
    agencyId: string
  ): Promise<IAgencySpecialNeedsMasterEntity | null> {
    const doc = await agencySpecialNeedsMasterDB
      .findOneAndUpdate(
        { _id: id, agencyId },
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      )
      .exec();
    if (!doc) return null;
    return AgencySpecialNeedsMasterMapper.toEntity(doc);
  }

  async findByNameAndAgencyId(
    name: string,
    agencyId: string
  ): Promise<IAgencySpecialNeedsMasterEntity | null> {
    const doc = await agencySpecialNeedsMasterDB
      .findOne({ name: name.trim(), agencyId, isDeleted: false })
      .exec();
    if (!doc) return null;
    return AgencySpecialNeedsMasterMapper.toEntity(doc);
  }
}
