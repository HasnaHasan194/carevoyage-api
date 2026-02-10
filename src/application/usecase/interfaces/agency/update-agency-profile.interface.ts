import { AgencyProfileResponseDTO } from "../../../dto/response/agency-profile-response.dto";
import { UpdateAgencyProfileRequestDTO } from "../../../dto/request/update-agency-profile-request.dto";

export interface IUpdateAgencyProfileUsecase {
  execute(
    userId: string,
    data: UpdateAgencyProfileRequestDTO
  ): Promise<AgencyProfileResponseDTO>;
}
