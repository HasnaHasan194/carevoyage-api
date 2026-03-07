import { AgencySpecialNeedsMasterResponseDTO } from "../../../dto/response/agency-special-needs-master-response.dto";

export interface ListAgencySpecialNeedsPaginatedResult {
  specialNeeds: AgencySpecialNeedsMasterResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListAgencySpecialNeedsMasterUsecase {
  execute(
    agencyId: string,
    includeDeleted?: boolean,
    page?: number,
    limit?: number
  ): Promise<ListAgencySpecialNeedsPaginatedResult>;
}
