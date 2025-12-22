import { inject, injectable } from "tsyringe";
import { CaretakerSignupRequestDTO } from "../../../dto/request/caretaker-signup-request.dto";
import { ICaretakerSignupUseCase } from "../../interfaces/caretaker/caretaker-signup.interface";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
import { ITokenService } from "../../../../domain/service-interfaces/token-service-interfaces";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { ValidationError } from "../../../../domain/errors/validationError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { hashPassword } from "../../../../shared/utils/bcryptHelper";
import { UserMapper } from "../../../mapper/user.mapper";

interface InviteTokenPayload {
  agencyId: string;
  agencyName: string;
  email: string;
  role: string;
  type: string;
  exp: number;
}

@injectable()
export class CaretakerSignupUseCase implements ICaretakerSignupUseCase {
  constructor(
    @inject("ITokenService")
    private _tokenService: ITokenService,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(
    request: CaretakerSignupRequestDTO
  ): Promise<LoginResponseDTO> {
    // Verify invite token
    const decoded = this._tokenService.verifyInviteToken(request.token);
    if (!decoded) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_TOKEN);
    }

    const payload = decoded as InviteTokenPayload;

    // Validate token type
    if (payload.type !== "caretaker_invite") {
      throw new ValidationError("Invalid invite token type");
    }

    // Validate role
    if (payload.role !== "caretaker") {
      throw new ValidationError("Invalid role in invite token");
    }

    // Check if user already exists
    const existingUser = await this._userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_EXISTS);
    }

    // Check if phone already exists
    const existingPhone = await this._userRepository.findByPhone(request.phone);
    if (existingPhone) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.PHONE_NUMBER_EXISTS);
    }

    // Find caretaker profile with status "invited" for this email and agency
    const invitedProfile = await this._caretakerProfileRepository.findByEmailAndAgencyId(
      payload.email,
      payload.agencyId
    );

    if (!invitedProfile || invitedProfile.status !== "invited" || invitedProfile.userId) {
      throw new NotFoundError(
        "No pending invitation found. Please request a new invitation."
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(request.password);

    // Create user with role caretaker
    const newUser = await this._userRepository.save({
      firstName: request.firstName,
      lastName: request.lastName,
      email: payload.email,
      password: hashedPassword,
      phone: request.phone,
      role: "caretaker",
      isBlocked: false,
    });

    // Activate caretaker profile
    await this._caretakerProfileRepository.activateProfile(
      invitedProfile._id,
      newUser._id
    );

    // Return login response
    return UserMapper.mapToLoginResponseDto(newUser);
  }
}

