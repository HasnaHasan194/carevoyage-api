import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { IWalletEntity, TWalletOwnerType } from "../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../domain/repositoryInterfaces/Wallet/wallet.repository.interface";
import { walletDB } from "../../database/models/wallet.model";
import { IWalletModel } from "../../database/schemas/wallet.schema";
import { BaseRepository } from "../baseRepository";

@injectable()
export class WalletRepository
  extends BaseRepository<IWalletModel, IWalletEntity>
  implements IWalletRepository
{
  constructor() {
    super(walletDB, (doc) => ({
      _id: String(doc._id),
      ownerId: String(doc.ownerId),
      ownerType: doc.ownerType,
      balance: doc.balance,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findByOwner(
    ownerId: string,
    ownerType: TWalletOwnerType,
    session?: ClientSession
  ): Promise<IWalletEntity | null> {
    const query = walletDB.findOne({ ownerId, ownerType });
    if (session) query.session(session);
    const doc = await query.exec();
    if (!doc) return null;
    return {
      _id: String(doc._id),
      ownerId: String(doc.ownerId),
      ownerType: doc.ownerType,
      balance: doc.balance,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

