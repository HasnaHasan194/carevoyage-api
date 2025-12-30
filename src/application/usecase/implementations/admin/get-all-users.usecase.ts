import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IGetAllUsersUsecase } from "../../interfaces/admin/getallusers.interface";
import { PaginatedUsersResponseDTO } from "../../../dto/response/user-response.dto";
import { UserMapper } from "../../../mapper/user.mapper";
import { UserStatusFilter, SortOrder } from "../../../dto/request/get-users-request.dto";

@injectable()
export class GetAllUsersUsecase implements IGetAllUsersUsecase {
  constructor(
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status: UserStatusFilter = UserStatusFilter.ALL,
    sort: string = "createdAt",
    order: SortOrder = SortOrder.ASC
  ): Promise<PaginatedUsersResponseDTO> {
    // Convert enum to string literal for repository
    const statusFilter: "all" | "blocked" | "unblocked" =
      status === UserStatusFilter.ALL
        ? "all"
        : status === UserStatusFilter.BLOCKED
        ? "blocked"
        : "unblocked";

    const sortOrder: "asc" | "desc" =
      order === SortOrder.ASC ? "asc" : "desc";

    const { users, total } = await this._userRepository.findAllWithSearch(
      page,
      limit,
      search,
      statusFilter,
      sort,
      sortOrder
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
