import { CurrentUserResponseDTO } from "../../../dto/response/current-user-response.dto";

export interface IGetCurrentUserUsecase {
  execute(userId: string): Promise<CurrentUserResponseDTO>;
}




