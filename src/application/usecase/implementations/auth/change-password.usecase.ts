import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { hashPassword } from "../../../../shared/utils/bcryptHelper";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IChangePasswordUseCase } from "../../interfaces/auth/change-password.interface";

@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string, newPassword: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
    }

    const hashed = await hashPassword(newPassword);
    await this._userRepository.updatePassword(userId, hashed);
  }
}

