import { AgencySpecialNeedsMasterResponseDTO } from "../../../dto/response/agency-special-needs-master-response.dto";

export interface IListAgencySpecialNeedsMasterUsecase {
  execute(
    agencyId: string,
    includeDeleted?: boolean
  ): Promise<AgencySpecialNeedsMasterResponseDTO[]>;
}
