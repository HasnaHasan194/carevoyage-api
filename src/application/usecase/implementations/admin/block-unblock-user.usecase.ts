import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IBlockUnblockUserUsecase } from "../../interfaces/admin/blockUnblock.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class BlockUnblockUserUsecase implements IBlockUnblockUserUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(userId: string, isBlocked: boolean): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
    }

    await this._userRepository.updateBlockStatus(userId, isBlocked);
  }
}
