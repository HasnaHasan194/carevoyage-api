import { LoginResponseDTO } from "../../../dto/response/login-response.dto";

export interface IGoogleAuthUsecase {
  execute(idToken: string): Promise<LoginResponseDTO>;
}

