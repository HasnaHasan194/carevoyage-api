import { CaretakerSignupRequestDTO } from "../../../dto/request/caretaker-signup-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";

export interface ICaretakerSignupUseCase {
  execute(request: CaretakerSignupRequestDTO): Promise<LoginResponseDTO>;
}



