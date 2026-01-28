import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { CurrentUserResponseDTO } from "../../../dto/response/current-user-response.dto";
import { IGetCurrentUserUsecase } from "../../interfaces/auth/get-current-user.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class GetCurrentUserUsecase implements IGetCurrentUserUsecase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<CurrentUserResponseDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
    }

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }
}




