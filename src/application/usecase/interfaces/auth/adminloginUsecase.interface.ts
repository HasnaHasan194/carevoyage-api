import { AdminLoginRequestDTO } from "../../../dto/request/adminlogin-request.dto";
import { LoginResponseDTO } from "../../../dto/response/login-response.dto";
export interface IAdminLoginUsecase{
    execute(data :AdminLoginRequestDTO):Promise<LoginResponseDTO>
}

