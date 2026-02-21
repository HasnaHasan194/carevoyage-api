import { IAgencySpecialNeedsEntity } from "../../entities/agency-special-needs.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IAgencySpecialNeedsRepository
  extends IBaseRepository<IAgencySpecialNeedsEntity> {
  findByAgencyId(
    agencyId: string,
    includeDeleted?: boolean
  ): Promise<IAgencySpecialNeedsEntity[]>;
  findByIdAndAgencyId(
    id: string,
    agencyId: string
  ): Promise<IAgencySpecialNeedsEntity | null>;
  findByAgencyIdAndSpecialNeedId(
    agencyId: string,
    specialNeedId: string
  ): Promise<IAgencySpecialNeedsEntity | null>;
  softDelete(id: string, agencyId: string): Promise<IAgencySpecialNeedsEntity | null>;
}
