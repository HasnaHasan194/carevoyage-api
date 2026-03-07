import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IReverifyAgencyUsecase } from "../../interfaces/auth/reverify-agency.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { redisClient } from "../../../../infrastructure/config/redis.config";

const REVERIFY_REDIS_PREFIX = "reverify_agency:";

@injectable()
export class ReverifyAgencyUsecase implements IReverifyAgencyUsecase {
  constructor(
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository
  ) {}

  async execute(token: string): Promise<void> {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      throw new ValidationError(
        ERROR_MESSAGE.AGENCY.REVERIFY_LINK_INVALID_OR_EXPIRED
      );
    }

    let agencyId: string | null = null;
    try {
      if (redisClient.isOpen) {
        agencyId = await redisClient.get(REVERIFY_REDIS_PREFIX + trimmedToken);
      }
    } catch {
      throw new ValidationError(
        ERROR_MESSAGE.AGENCY.REVERIFY_LINK_INVALID_OR_EXPIRED
      );
    }

    if (!agencyId) {
      throw new ValidationError(
        ERROR_MESSAGE.AGENCY.REVERIFY_LINK_INVALID_OR_EXPIRED
      );
    }

    const agency = await this._agencyRepository.findById(agencyId);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }

    if (agency.verificationStatus !== "rejected") {
      throw new ValidationError(
        ERROR_MESSAGE.AGENCY.REVERIFY_LINK_INVALID_OR_EXPIRED
      );
    }

    await this._agencyRepository.updateVerificationStatus(agencyId, "pending");

    try {
      if (redisClient.isOpen) {
        await redisClient.del(REVERIFY_REDIS_PREFIX + trimmedToken);
      }
    } catch {
      // Token already consumed=> continue
    }
  }
}
