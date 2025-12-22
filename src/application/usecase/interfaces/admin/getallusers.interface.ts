import { PaginatedUsersResponseDTO } from "../../../dto/response/user-response.dto";

export interface IGetAllUsersUsecase {
  execute(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedUsersResponseDTO>;
}
