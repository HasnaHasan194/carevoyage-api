import { UpdateSpecialNeedRequestDTO } from "../../../dto/request/update-special-need-request.dto";
import { AgencySpecialNeedsResponseDTO } from "../../../dto/response/agency-special-needs-response.dto";

export interface IUpdateSpecialNeedUsecase {
  execute(
    id: string,
    agencyId: string,
    data: UpdateSpecialNeedRequestDTO
  ): Promise<AgencySpecialNeedsResponseDTO>;
}
