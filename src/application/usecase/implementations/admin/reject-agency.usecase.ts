import { randomBytes } from "crypto";
import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IEmailService } from "../../../../domain/service-interfaces/email-service.interface";
import { IRejectAgencyUsecase } from "../../interfaces/admin/reject-agency.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { redisClient } from "../../../../infrastructure/config/redis.config";
import { config } from "../../../../shared/config";

@injectable()
export class RejectAgencyUsecase implements IRejectAgencyUsecase {
  constructor(
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository,
    @inject("IEmailService")
    private _emailService: IEmailService
  ) {}

  async execute(agencyId: string, reason: string): Promise<void> {
    const agency = await this._agencyRepository.findById(agencyId);

    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }

    if (agency.verificationStatus !== "pending") {
      throw new ValidationError(ERROR_MESSAGE.AGENCY.NOT_PENDING);
    }

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      throw new ValidationError("Rejection reason is required");
    }

    await this._agencyRepository.updateVerificationStatus(
      agencyId,
      "rejected",
      trimmedReason
    );

    const owner = await this._userRepository.findById(agency.userId);
    if (owner?.email) {
      let reverifyLink: string | undefined;
      if (config.client?.URI) {
        try {
          if (redisClient.isOpen) {
            const token = randomBytes(32).toString("hex");
            const redisKey = `reverify_agency:${token}`;
            await redisClient.set(redisKey, agencyId, { EX: 604800 });
            reverifyLink = `${config.client.URI}/agency/reverify?token=${token}`;
          }
        } catch {
          // Continue without reverify link if Redis unavailable
        }
      }
      const html = this.getRejectionEmailHtml(
        agency.agencyName,
        trimmedReason,
        reverifyLink
      );
      await this._emailService.sendMail(
        owner.email,
        "Agency Registration Not Approved - CareVoyage",
        html
      );
    }
  }

  private getRejectionEmailHtml(
    agencyName: string,
    reason: string,
    reverifyLink?: string
  ): string {
    const escapedReason = reason
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/\n/g, "<br />");
    const escapedName = agencyName
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);">
        <div style="background: linear-gradient(to right, #DC2626, #B91C1C); padding: 24px; color: white; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">Agency Registration Update</h2>
          <p style="margin: 8px 0 0; font-size: 14px;">Your agency application has been reviewed</p>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 15px; color: #555;">Thank you for submitting your agency <strong>${escapedName}</strong> for verification on CareVoyage.</p>
          <p style="font-size: 15px; color: #555;">After careful review, we are unable to approve your agency registration at this time.</p>
          <p style="font-size: 15px; color: #555;"><strong>Reason for rejection:</strong></p>
          <div style="background: #FEF2F2; border-left: 4px solid #DC2626; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <p style="font-size: 14px; color: #374151; margin: 0; line-height: 1.6;">${escapedReason}</p>
          </div>
          <p style="font-size: 14px; color: #666;">If you have questions or would like to reapply after addressing the above, you can request reverification using the link below.</p>
          ${reverifyLink ? `
          <div style="text-align: center; margin: 28px 0;">
            <a href="${reverifyLink}" style="display: inline-block; background-color: #059669; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Request Reverification</a>
          </div>
          <p style="font-size: 12px; color: #888;">This link is valid for 7 days. If the link has expired, please contact our support team.</p>
          ` : ""}
          <p style="font-size: 13px; color: #aaa; margin-top: 40px; text-align: center;">
            Regards,<br/>The CareVoyage Team
          </p>
        </div>
      </div>
    `;
  }
}
