import { IAgencyEntity } from "../../../../domain/entities/Agency.entity";

export interface IRegisterAgencyUsecase {
  execute(data: Partial<IAgencyEntity>): Promise<void>;
}
