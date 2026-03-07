import { ICaretakerRequestEntity } from "../../entities/caretaker-request.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface ICaretakerRequestRepository extends IBaseRepository<ICaretakerRequestEntity> {
  findPendingByClientAndPackage(
    clientId: string,
    packageId: string
  ): Promise<ICaretakerRequestEntity | null>;
  findByAgencyId(agencyId: string): Promise<ICaretakerRequestEntity[]>;
  findByAgencyIdPaginated(
    agencyId: string,
    page: number,
    limit: number,
    status?: "pending" | "fulfilled"
  ): Promise<ICaretakerRequestEntity[]>;
  countByAgencyId(
    agencyId: string,
    status?: "pending" | "fulfilled"
  ): Promise<number>;
}
