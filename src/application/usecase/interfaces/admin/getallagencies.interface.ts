import { PaginatedAgenciesResponseDTO } from "../../../dto/response/agency-response.dto";
import { AgencyStatusFilter, SortOrder } from "../../../dto/request/get-agencies-request.dto";

export interface IGetAllAgenciesUsecase {
  execute(
    page: number,
    limit: number,
    search?: string,
    status?: AgencyStatusFilter,
    sort?: string,
    order?: SortOrder
  ): Promise<PaginatedAgenciesResponseDTO>;
}


