import { injectable } from "tsyringe";
import { CategoryMapper } from "../../../application/mapper/category.mapper";
import { ICategoryEntity } from "../../../domain/entities/category.entity";
import { ICategoryRepository } from "../../../domain/repositoryInterfaces/Category/category.repository.interface";
import { categoryDB } from "../../database/models/category.model";
import { ICategoryModel } from "../../database/models/interfaces/category.model.interface";
import { BaseRepository } from "../baseRepository";

@injectable()
export class CategoryRepository
  extends BaseRepository<ICategoryModel, ICategoryEntity>
  implements ICategoryRepository
{
  constructor() {
    super(categoryDB, CategoryMapper.toEntity);
  }

  async findByAgencyId(
    agencyId: string,
    includeDeleted: boolean = false
  ): Promise<ICategoryEntity[]> {
    const query: any = { agencyId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const docs = await categoryDB.find(query).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => CategoryMapper.toEntity(doc));
  }

  async findByAgencyIdPaginated(
    agencyId: string,
    includeDeleted: boolean,
    page: number,
    limit: number
  ): Promise<ICategoryEntity[]> {
    const query: Record<string, unknown> = { agencyId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    const docs = await categoryDB
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .exec();

    return docs.map((doc) => CategoryMapper.toEntity(doc));
  }

  async countByAgencyId(
    agencyId: string,
    includeDeleted: boolean
  ): Promise<number> {
    const query: Record<string, unknown> = { agencyId };
    if (!includeDeleted) {
      query.isDeleted = false;
    }
    return categoryDB.countDocuments(query).exec();
  }

  async findActiveByAgencyId(agencyId: string): Promise<ICategoryEntity[]> {
    const docs = await categoryDB
      .find({ agencyId, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => CategoryMapper.toEntity(doc));
  }

  async findByIdAndAgencyId(
    categoryId: string,
    agencyId: string
  ): Promise<ICategoryEntity | null> {
    const doc = await categoryDB
      .findOne({ _id: categoryId, agencyId })
      .exec();
    if (!doc) return null;
    return CategoryMapper.toEntity(doc);
  }

  async softDelete(
    categoryId: string,
    agencyId: string
  ): Promise<ICategoryEntity | null> {
    const doc = await categoryDB
      .findOneAndUpdate(
        { _id: categoryId, agencyId },
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      )
      .exec();
    if (!doc) return null;
    return CategoryMapper.toEntity(doc);
  }

  async findByNameAndAgencyId(
    name: string,
    agencyId: string
  ): Promise<ICategoryEntity | null> {
    const doc = await categoryDB
      .findOne({ name: name.trim(), agencyId, isDeleted: false })
      .exec();
    if (!doc) return null;
    return CategoryMapper.toEntity(doc);
  }

  async findAllActiveCategoryNames(): Promise<string[]> {
    const docs = await categoryDB
      .find({ isDeleted: false })
      .select("name")
      .exec();
    return docs.map((doc) => doc.name);
  }
}
