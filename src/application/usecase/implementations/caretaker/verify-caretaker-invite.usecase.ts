import { inject, injectable } from "tsyringe";
import { IVerifyCaretakerInviteUseCase } from "../../interfaces/caretaker/verify-caretaker-invite.interface";
import { VerifyCaretakerInviteResponseDTO } from "../../../dto/response/verify-invite-response.dto";
import { ITokenService } from "../../../../domain/service-interfaces/token-service-interfaces";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

interface InviteTokenPayload {
  agencyId: string;
  agencyName: string;
  email: string;
  role: string;
  type: string;
  exp: number;
}

@injectable()
export class VerifyCaretakerInviteUseCase
  implements IVerifyCaretakerInviteUseCase
{
  constructor(
    @inject("ITokenService")
    private _tokenService: ITokenService,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository
  ) {}

  async execute(token: string): Promise<VerifyCaretakerInviteResponseDTO> {
    // Verify token
    const decoded = this._tokenService.verifyInviteToken(token);
    if (!decoded) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_TOKEN);
    }

    const payload = decoded as InviteTokenPayload;

    // Validate token type
    if (payload.type !== "caretaker_invite") {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_INVITE_TOKEN_TYPE);
    }

    // Validate role
    if (payload.role !== "caretaker") {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_ROLE_IN_INVITE_TOKEN);
    }

    // Check if caretaker profile exists with status "invited" for this email
    const invitedProfile = await this._caretakerProfileRepository.findByEmailAndAgencyId(
      payload.email,
      payload.agencyId
    );

    if (!invitedProfile || invitedProfile.status !== "invited" || invitedProfile.userId) {
      throw new NotFoundError(ERROR_MESSAGE.CARETAKER.NO_PENDING_INVITATION_FOR_EMAIL_AND_AGENCY);
    }

    return {
      email: payload.email,
      agencyName: payload.agencyName,
      agencyId: payload.agencyId,
      isValid: true,
    };
  }
}

