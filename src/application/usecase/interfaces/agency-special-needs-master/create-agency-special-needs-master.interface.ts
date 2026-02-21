import { CreateAgencySpecialNeedsMasterRequestDTO } from "../../../dto/request/create-agency-special-needs-master-request.dto";
import { AgencySpecialNeedsMasterResponseDTO } from "../../../dto/response/agency-special-needs-master-response.dto";

export interface ICreateAgencySpecialNeedsMasterUsecase {
  execute(
    agencyId: string,
    data: CreateAgencySpecialNeedsMasterRequestDTO
  ): Promise<AgencySpecialNeedsMasterResponseDTO>;
}
