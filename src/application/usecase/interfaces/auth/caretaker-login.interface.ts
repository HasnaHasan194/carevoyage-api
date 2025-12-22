import { CaretakerLoginRequestDTO } from "../../../dto/request/caretaker-login-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";

export interface ICaretakerLoginUseCase {
  execute(data: CaretakerLoginRequestDTO): Promise<LoginResponseDTO>;
}

