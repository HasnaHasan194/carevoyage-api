import { IAgencyEntity } from "../../entities/Agency.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IAgencyRepository extends IBaseRepository<IAgencyEntity> {
  findByUserId(userId: string): Promise<IAgencyEntity | null>;
  updateVerificationStatus(
    agencyId: string,
    status: "pending" | "verified" | "rejected"
  ): Promise<IAgencyEntity | null>;

  updateBlockStatus(agencyId: string, isBlocked: boolean): Promise<boolean>;

  findByRegistrationNumber(
    registrationNumber: string
  ): Promise<IAgencyEntity | null>;
}
