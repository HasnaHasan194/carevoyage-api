import { AgencyLoginRequestDTO } from "../../../dto/request/agencylogin-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
export interface IAgencyLoginUsecase {
  execute(data: AgencyLoginRequestDTO): Promise<LoginResponseDTO>;
}
