import { PaginatedAgenciesResponseDTO } from "../../../dto/response/agency-response.dto";
import { AgencyStatusFilter, AgencyVerificationStatusFilter, SortOrder } from "../../../dto/request/get-agencies-request.dto";

export interface IGetAllAgenciesUsecase {
  execute(
    page: number,
    limit: number,
    search?: string,
    status?: AgencyStatusFilter,
    verificationStatus?: AgencyVerificationStatusFilter,
    sort?: string,
    order?: SortOrder
  ): Promise<PaginatedAgenciesResponseDTO>;
}





