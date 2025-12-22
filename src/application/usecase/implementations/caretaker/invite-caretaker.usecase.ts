import { inject, injectable } from "tsyringe";
import { InviteCaretakerRequestDTO } from "../../../dto/request/invite-caretaker-request.dto";
import { IInviteCaretakerUseCase } from "../../interfaces/caretaker/invite-caretaker.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { ITokenService } from "../../../../domain/service-interfaces/token-service-interfaces";
import { IEmailService } from "../../../../domain/service-interfaces/email-service.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { config } from "../../../../shared/config";

@injectable()
export class InviteCaretakerUseCase implements IInviteCaretakerUseCase {
  constructor(
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository,
    @inject("ITokenService")
    private _tokenService: ITokenService,
    @inject("IEmailService")
    private _emailService: IEmailService
  ) {}

  async execute(
    agencyId: string,
    request: InviteCaretakerRequestDTO
  ): Promise<void> {
    // Verify agency exists
    const agency = await this._agencyRepository.findById(agencyId);
    if (!agency) {
      throw new NotFoundError("Agency not found");
    }

    // Check if user with this email already exists
    const existingUser = await this._userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_EXISTS);
    }

    // Check if caretaker profile already exists for this email and agency
    const existingProfile = await this._caretakerProfileRepository.findByEmailAndAgencyId(
      request.email,
      agency._id
    );
    if (existingProfile) {
      if (existingProfile.status === "invited" && !existingProfile.userId) {
        throw new ValidationError("Invitation already sent to this email");
      }
      if (existingProfile.status === "active") {
        throw new ValidationError("Caretaker already registered with this email");
      }
    }

    // Generate invite token
    const inviteToken = this._tokenService.generateInviteToken({
      agencyId: agency._id,
      agencyName: agency.agencyName,
      email: request.email,
      role: "caretaker",
      type: "caretaker_invite",
    });

    // Create caretaker profile with status "invited"
    // Nationality and address will be collected during signup or profile completion
    await this._caretakerProfileRepository.save({
      agencyId: agency._id,
      email: request.email,
      userId: undefined,
      languages: [],
      experienceYears: 0,
      documents: [],
      status: "invited",
      kycDocs: [],
      rating: 0,
      reviewCount: 0,
    });

    // Send invitation email
    const signupUrl = `${config.client.URI}/caretaker/signup?token=${inviteToken}`;
    const emailSubject = "CareVoyage - Caretaker Invitation";
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You've been invited to join ${agency.agencyName} as a Caretaker</h2>
        <p>Click the link below to complete your registration:</p>
        <a href="${signupUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Complete Registration
        </a>
        <p>This invitation link will expire in 48 hours.</p>
        <p>If you did not expect this invitation, please ignore this email.</p>
      </div>
    `;

    await this._emailService.sendMail(request.email, emailSubject, emailHtml);
  }
}

