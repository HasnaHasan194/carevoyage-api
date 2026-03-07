import { AgencySpecialNeedsMasterResponseDTO } from "../../../dto/response/agency-special-needs-master-response.dto";

export interface IListActiveAgencySpecialNeedsMasterUsecase {
  execute(
    agencyId: string
  ): Promise<AgencySpecialNeedsMasterResponseDTO[]>;
}
