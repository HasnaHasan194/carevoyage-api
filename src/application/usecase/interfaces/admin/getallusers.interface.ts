import { PaginatedUsersResponseDTO } from "../../../dto/response/user-response.dto";
import { UserStatusFilter, SortOrder } from "../../../dto/request/get-users-request.dto";

export interface IGetAllUsersUsecase {
  execute(
    page: number,
    limit: number,
    search?: string,
    status?: UserStatusFilter,
    sort?: string,
    order?: SortOrder
  ): Promise<PaginatedUsersResponseDTO>;
}
