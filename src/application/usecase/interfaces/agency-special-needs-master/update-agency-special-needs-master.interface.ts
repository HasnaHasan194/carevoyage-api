import { UpdateAgencySpecialNeedsMasterRequestDTO } from "../../../dto/request/update-agency-special-needs-master-request.dto";
import { AgencySpecialNeedsMasterResponseDTO } from "../../../dto/response/agency-special-needs-master-response.dto";

export interface IUpdateAgencySpecialNeedsMasterUsecase {
  execute(
    id: string,
    agencyId: string,
    data: UpdateAgencySpecialNeedsMasterRequestDTO
  ): Promise<AgencySpecialNeedsMasterResponseDTO>;
}
