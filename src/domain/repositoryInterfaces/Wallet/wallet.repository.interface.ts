import { ClientSession } from "mongoose";
import { IWalletEntity, TWalletOwnerType } from "../../entities/wallet.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IWalletRepository extends IBaseRepository<IWalletEntity> {
  findByOwner(
    ownerId: string,
    ownerType: TWalletOwnerType,
    session?: ClientSession
  ): Promise<IWalletEntity | null>;
}

