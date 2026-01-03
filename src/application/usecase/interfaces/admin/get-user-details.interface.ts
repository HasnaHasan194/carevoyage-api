import { UserResponseDTO } from "../../../dto/response/user-response.dto";

export interface IGetUserDetailsUsecase {
  execute(userId: string): Promise<UserResponseDTO>;
}




