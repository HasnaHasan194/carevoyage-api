import { inject, injectable } from "tsyringe";
import { ValidationError } from "../../../../domain/errors/validationError";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { comparePassword } from "../../../../shared/utils/bcryptHelper";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IVerifyOldPasswordUseCase } from "../../interfaces/auth/verify-old-password.interface";

@injectable()
export class VerifyOldPasswordUseCase implements IVerifyOldPasswordUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string, oldPassword: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
    }

    const ok = await comparePassword(oldPassword, user.password);
    if (!ok) {
      throw new ValidationError(ERROR_MESSAGE.AUTHENTICATION.PASSWORD_INCORRECT);
    }
  }
}

