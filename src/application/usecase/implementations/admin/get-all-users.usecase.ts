import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IGetAllUsersUsecase } from "../../interfaces/admin/getallusers.interface";
import { PaginatedUsersResponseDTO } from "../../../dto/response/user-response.dto";
import { UserMapper } from "../../../mapper/user.mapper";

@injectable()
export class GetAllUsersUsecase implements IGetAllUsersUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedUsersResponseDTO> {
    const { users, total } = await this._userRepository.findAllWithSearch(
      page,
      limit,
      search
    );

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map((user) => UserMapper.toUserResponseDto(user)),
      total,
      page,
      limit,
      totalPages,
    };
  }
}
