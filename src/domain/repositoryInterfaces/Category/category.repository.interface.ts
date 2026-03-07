import { ICategoryEntity } from "../../entities/category.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface ICategoryRepository extends IBaseRepository<ICategoryEntity> {
  findByAgencyId(agencyId: string, includeDeleted?: boolean): Promise<ICategoryEntity[]>;
  findByAgencyIdPaginated(
    agencyId: string,
    includeDeleted: boolean,
    page: number,
    limit: number
  ): Promise<ICategoryEntity[]>;
  countByAgencyId(agencyId: string, includeDeleted: boolean): Promise<number>;
  findActiveByAgencyId(agencyId: string): Promise<ICategoryEntity[]>;
  findByIdAndAgencyId(categoryId: string, agencyId: string): Promise<ICategoryEntity | null>;
  softDelete(categoryId: string, agencyId: string): Promise<ICategoryEntity | null>;
  findByNameAndAgencyId(name: string, agencyId: string): Promise<ICategoryEntity | null>;
  findAllActiveCategoryNames(): Promise<string[]>;
}
