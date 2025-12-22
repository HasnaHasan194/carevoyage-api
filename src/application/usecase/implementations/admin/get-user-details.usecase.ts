import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IGetUserDetailsUsecase } from "../../interfaces/admin/get-user-details.interface";
import { UserResponseDTO } from "../../../dto/response/user-response.dto";
import { UserMapper } from "../../../mapper/user.mapper";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class GetUserDetailsUsecase implements IGetUserDetailsUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<UserResponseDTO> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return UserMapper.toUserResponseDto(user);
  }
}

