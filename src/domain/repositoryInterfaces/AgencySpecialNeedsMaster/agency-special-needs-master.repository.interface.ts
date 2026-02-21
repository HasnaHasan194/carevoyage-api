import { IAgencySpecialNeedsMasterEntity } from "../../entities/agency-special-needs-master.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IAgencySpecialNeedsMasterRepository
  extends IBaseRepository<IAgencySpecialNeedsMasterEntity> {
  findByAgencyId(
    agencyId: string,
    includeDeleted?: boolean
  ): Promise<IAgencySpecialNeedsMasterEntity[]>;
  findActiveByAgencyId(agencyId: string): Promise<IAgencySpecialNeedsMasterEntity[]>;
  findByIdAndAgencyId(
    id: string,
    agencyId: string
  ): Promise<IAgencySpecialNeedsMasterEntity | null>;
  softDelete(
    id: string,
    agencyId: string
  ): Promise<IAgencySpecialNeedsMasterEntity | null>;
  findByNameAndAgencyId(
    name: string,
    agencyId: string
  ): Promise<IAgencySpecialNeedsMasterEntity | null>;
}
