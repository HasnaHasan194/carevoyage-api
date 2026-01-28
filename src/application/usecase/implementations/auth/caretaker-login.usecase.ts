import { inject, injectable } from "tsyringe";
import { ILoginUsecase } from "../../interfaces/auth/loginUsecase.interface";
import { CaretakerLoginRequestDTO } from "../../../dto/request/caretaker-login-request.dto";
import { BaseLoginRequest } from "../../../dto/request/base-login-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { ICaretakerProfileRepository } from "../../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { comparePassword } from "../../../../shared/utils/bcryptHelper";
import { UserMapper } from "../../../mapper/user.mapper";

@injectable()
export class CaretakerLoginUseCase implements ILoginUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository
  ) {}

  async execute(data: BaseLoginRequest): Promise<LoginResponseDTO> {
    const caretakerLoginData = data as CaretakerLoginRequestDTO;
    // Find user by email
    const user = await this._userRepository.findByEmail(caretakerLoginData.email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_NOT_FOUND);
    }

    // Verify role is caretaker
    if (user.role !== "caretaker") {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.INVALID_ACCOUNT_TYPE_NOT_CARETAKER);
    }

    // Check if user is blocked
    if (user.isBlocked) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.USER_BLOCKED);
    }

    // Verify password
    const isPasswordMatch =await  comparePassword(caretakerLoginData.password,user.password);

    if (!isPasswordMatch) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.PASSWORD_INCORRECT);
    }

    // Find caretaker profile
    const caretakerProfile = await this._caretakerProfileRepository.findByUserId(user._id);

    if (!caretakerProfile) {
      throw new NotFoundError(ERROR_MESSAGE.CARETAKER.PROFILE_NOT_FOUND_CONTACT_SUPPORT);
    }

    // Verify caretaker profile status is active
    if (caretakerProfile.status !== "active") {
      throw new ValidationError(ERROR_MESSAGE.CARETAKER.PROFILE_NOT_ACTIVE);
    }

    return UserMapper.mapToLoginResponseDto(user);
  }
}




