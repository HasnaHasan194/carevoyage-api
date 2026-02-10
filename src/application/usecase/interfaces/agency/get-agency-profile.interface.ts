import { AgencyProfileResponseDTO } from "../../../dto/response/agency-profile-response.dto";

export interface IGetAgencyProfileUsecase {
  execute(userId: string): Promise<AgencyProfileResponseDTO>;
}
