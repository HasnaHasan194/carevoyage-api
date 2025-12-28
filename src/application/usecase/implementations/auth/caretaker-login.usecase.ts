import { inject, injectable } from "tsyringe";
import { ICaretakerLoginUseCase } from "../../interfaces/auth/caretaker-login.interface";
import { CaretakerLoginRequestDTO } from "../../../dto/request/caretaker-login-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { comparePassword } from "../../../../shared/utils/bcryptHelper";
import { UserMapper } from "../../../mapper/user.mapper";

@injectable()
export class CaretakerLoginUseCase implements ICaretakerLoginUseCase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository
  ) {}

  async execute(data: CaretakerLoginRequestDTO): Promise<LoginResponseDTO> {
    // Find user by email
    const user = await this._userRepository.findByEmail(data.email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_NOT_FOUND);
    }

    // Verify role is caretaker
    if (user.role !== "caretaker") {
      throw new ValidationError("Invalid account type. This is not a caretaker account.");
    }

    // Check if user is blocked
    if (user.isBlocked) {
      throw new ValidationError("Your account has been blocked. Please contact support.");
    }

    // Verify password
    const isPasswordMatch =  comparePassword(user.password, data.password);

    if (!isPasswordMatch) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.PASSWORD_INCORRECT);
    }

    // Find caretaker profile
    const caretakerProfile = await this._caretakerProfileRepository.findByUserId(user._id);

    if (!caretakerProfile) {
      throw new NotFoundError("Caretaker profile not found. Please contact support.");
    }

    // Verify caretaker profile status is active
    if (caretakerProfile.status !== "active") {
      throw new ValidationError(
        "Your caretaker profile is not active. Please contact your agency or support."
      );
    }

    return UserMapper.mapToLoginResponseDto(user);
  }
}



