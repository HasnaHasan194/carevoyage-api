import { IUserEntity } from "../../../../domain/entities/user.entity";

export interface IRegisterUsecase{
    execute(data : Partial<IUserEntity>) : Promise<void>;
}