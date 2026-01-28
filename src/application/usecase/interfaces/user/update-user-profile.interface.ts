import { IUserEntity } from "../../../../domain/entities/user.entity";
import { UpdateUserProfileRequestDTO } from "../../../dto/request/update-user-profile-request.dto";

export interface IUpdateUserProfileUsecase {
  execute(
    userId: string,
    data: UpdateUserProfileRequestDTO
  ): Promise<IUserEntity>;
}
