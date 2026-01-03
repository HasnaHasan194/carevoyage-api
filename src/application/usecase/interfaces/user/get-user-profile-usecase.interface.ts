import { IUserEntity } from "../../../../domain/entities/user.entity";

export interface IGetUserProfileUsecase {
  execute(userId: string): Promise<IUserEntity>;
}
