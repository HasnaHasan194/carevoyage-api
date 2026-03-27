import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IAdminRepository } from "../../../../domain/repositoryInterfaces/Admin/admin.repository.interface";
import { IReverifyAgencyUsecase } from "../../interfaces/auth/reverify-agency.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { redisClient } from "../../../../infrastructure/config/redis.config";
import { NotificationService } from "../../../services/notification/notification.service";

const REVERIFY_REDIS_PREFIX = "reverify_agency:";

@injectable()
export class ReverifyAgencyUsecase implements IReverifyAgencyUsecase {
  constructor(
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository,
    @inject("IAdminRepository")
    private readonly _adminRepository: IAdminRepository,
    @inject(NotificationService)
    private readonly _notificationService: NotificationService
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

    const admins = await this._adminRepository.listAll();
    const notifications = admins.map((admin) =>
      this._notificationService.createAndPublish({
        recipientUserId: admin._id,
        recipientRole: "admin",
        type: "AGENCY_REVERIFY_REQUESTED",
        title: "Agency requested reverification",
        message: `${agency.agencyName} requested reverification.`,
        link: "/admin/agencies",
        metadata: { type: "AGENCY_REVERIFY_REQUESTED", agencyId: agency._id },
      })
    );
    await Promise.all(notifications);

    try {
      if (redisClient.isOpen) {
        await redisClient.del(REVERIFY_REDIS_PREFIX + trimmedToken);
      }
    } catch {
      // Token already consumed=> continue
    }
  }
}
