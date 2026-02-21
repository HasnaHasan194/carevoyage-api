import { injectable } from "tsyringe";
import { SpecialNeedsMasterMapper } from "../../../application/mapper/special-needs-master.mapper";
import { ISpecialNeedsMasterEntity } from "../../../domain/entities/special-needs-master.entity";
import { ISpecialNeedsMasterRepository } from "../../../domain/repositoryInterfaces/SpecialNeedsMaster/special-needs-master.repository.interface";
import { specialNeedsMasterDB } from "../../database/models/special-needs-master.model";
import { ISpecialNeedsMasterModel } from "../../database/models/interfaces/special-needs-master.model.interface";
import { BaseRepository } from "../baseRepository";

@injectable()
export class SpecialNeedsMasterRepository
  extends BaseRepository<ISpecialNeedsMasterModel, ISpecialNeedsMasterEntity>
  implements ISpecialNeedsMasterRepository
{
  constructor() {
    super(specialNeedsMasterDB, SpecialNeedsMasterMapper.toEntity);
  }

  async findActive(): Promise<ISpecialNeedsMasterEntity[]> {
    const docs = await specialNeedsMasterDB
      .find({ isActive: true })
      .sort({ category: 1, name: 1 })
      .exec();
    return docs.map((doc) => SpecialNeedsMasterMapper.toEntity(doc));
  }

  async findById(id: string): Promise<ISpecialNeedsMasterEntity | null> {
    const doc = await specialNeedsMasterDB.findById(id).exec();
    if (!doc) return null;
    return SpecialNeedsMasterMapper.toEntity(doc);
  }

  async findByCategory(
    category: string
  ): Promise<ISpecialNeedsMasterEntity[]> {
    const docs = await specialNeedsMasterDB
      .find({ category, isActive: true })
      .sort({ name: 1 })
      .exec();
    return docs.map((doc) => SpecialNeedsMasterMapper.toEntity(doc));
  }
}
