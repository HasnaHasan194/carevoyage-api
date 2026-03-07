import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IVerifyAgencyUsecase } from "../../interfaces/admin/verify-agency.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class VerifyAgencyUsecase implements IVerifyAgencyUsecase {
  constructor(
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository
  ) {}

  async execute(agencyId: string): Promise<void> {
    const agency = await this._agencyRepository.findById(agencyId);

    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }

    if (agency.verificationStatus !== "pending") {
      throw new ValidationError(ERROR_MESSAGE.AGENCY.NOT_PENDING);
    }

    await this._agencyRepository.updateVerificationStatus(agencyId, "verified");
  }
}
