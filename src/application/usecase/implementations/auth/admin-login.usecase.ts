import { inject, injectable } from "tsyringe";
import { IAdminLoginUsecase } from "../../../../application/usecase/interfaces/auth/adminloginUsecase.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { AdminLoginRequestDTO } from "../../../dto/request/adminlogin-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { comparePassword } from "../../../../shared/utils/bcryptHelper";
import { UserMapper } from "../../../mapper/user.mapper";

@injectable()
export class AdminLoginUsecase implements IAdminLoginUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(data: AdminLoginRequestDTO): Promise<LoginResponseDTO> {
    const admin = await this._userRepository.findByEmail(data.email);
    if (!admin) {
      throw new NotFoundError(ERROR_MESSAGE.AUTHENTICATION.EMAIL_NOT_FOUND);
    }

    if (admin.role !== "admin") {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.UNAUTHORIZED_ROLE);
    }

    if (admin.isBlocked) {
      throw new ValidationError("Your account has been blocked. Please contact support.");
    }

    const isPasswordMatch = await comparePassword(
      data.password,
      admin.password
    );


    if (!isPasswordMatch) {
      throw new ValidationError(
        ERROR_MESSAGE.AUTHENTICATION.PASSWORD_INCORRECT
      );
    }

    return UserMapper.mapToLoginResponseDto(admin);
  }
}
