import { LoginRequestDTO } from "../../../dto/request/login-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
export interface ILoginUsecase {
  execute(data: LoginRequestDTO): Promise<LoginResponseDTO>;
}
