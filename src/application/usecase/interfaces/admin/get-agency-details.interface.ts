import { AgencyResponseDTO } from "../../../dto/response/agency-response.dto";

export interface IGetAgencyDetailsUsecase {
  execute(agencyId: string): Promise<AgencyResponseDTO>;
}


