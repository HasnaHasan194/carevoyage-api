import { EnableSpecialNeedRequestDTO } from "../../../dto/request/enable-special-need-request.dto";
import { AgencySpecialNeedsResponseDTO } from "../../../dto/response/agency-special-needs-response.dto";

export interface IEnableSpecialNeedUsecase {
  execute(
    agencyId: string,
    data: EnableSpecialNeedRequestDTO
  ): Promise<AgencySpecialNeedsResponseDTO>;
}
