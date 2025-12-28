import { ICaretakerProfileEntity } from "../../../domain/entities/caretaker-profile.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface ICaretakerProfileRepository
  extends IBaseRepository<ICaretakerProfileEntity> {
  findByAgencyId(agencyId: string): Promise<ICaretakerProfileEntity[]>;
  findByUserId(userId: string): Promise<ICaretakerProfileEntity | null>;
  findByEmailAndAgencyId(
    email: string,
    agencyId: string
  ): Promise<ICaretakerProfileEntity | null>;
  updateStatus(
    profileId: string,
    status: "invited" | "active" | "blocked"
  ): Promise<ICaretakerProfileEntity | null>;
  activateProfile(
    profileId: string,
    userId: string
  ): Promise<ICaretakerProfileEntity | null>;
}



