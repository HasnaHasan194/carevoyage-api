import { BaseLoginRequest } from "../../../dto/request/base-login-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";

export interface ILoginUsecase {
  execute(data: BaseLoginRequest): Promise<LoginResponseDTO>;
}
