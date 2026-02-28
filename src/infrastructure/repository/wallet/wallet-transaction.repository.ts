import { injectable } from "tsyringe";
import {
  IWalletTransactionEntity,
  TWalletTransactionSortOrder,
  TWalletTransactionType,
} from "../../../domain/entities/wallet-transaction.entity";
import { IWalletTransactionRepository } from "../../../domain/repositoryInterfaces/Wallet/wallet-transaction.repository.interface";
import { walletTransactionDB } from "../../database/models/wallet-transaction.model";
import { IWalletTransactionModel } from "../../database/schemas/wallet-transaction.schema";
import { BaseRepository } from "../baseRepository";

@injectable()
export class WalletTransactionRepository
  extends BaseRepository<IWalletTransactionModel, IWalletTransactionEntity>
  implements IWalletTransactionRepository
{
  constructor() {
    super(walletTransactionDB, (doc) => ({
      _id: String(doc._id),
      walletId: String(doc.walletId),
      type: doc.type,
      source: doc.source,
      referenceId: doc.referenceId,
      amount: doc.amount,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findByWalletId(
    walletId: string
  ): Promise<IWalletTransactionEntity[]> {
    const docs = await walletTransactionDB
      .find({ walletId })
      .sort({ createdAt: -1 })
      .exec();

    return docs.map((doc) => ({
      _id: String(doc._id),
      walletId: String(doc.walletId),
      type: doc.type,
      source: doc.source,
      referenceId: doc.referenceId,
      amount: doc.amount,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findByWalletIdPaginated(
    walletId: string,
    page: number,
    limit: number,
    type?: TWalletTransactionType,
    sortOrder?: TWalletTransactionSortOrder
  ): Promise<IWalletTransactionEntity[]> {
    const skip = (page - 1) * limit;
    const filter: Record<string, string> = { walletId };
    if (type) filter.type = type;
    const sortDir = sortOrder === "oldest" ? 1 : -1;

    const docs = await walletTransactionDB
      .find(filter)
      .sort({ createdAt: sortDir })
      .skip(skip)
      .limit(limit)
      .exec();

    return docs.map((doc) => ({
      _id: String(doc._id),
      walletId: String(doc.walletId),
      type: doc.type,
      source: doc.source,
      referenceId: doc.referenceId,
      amount: doc.amount,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async countByWalletId(
    walletId: string,
    type?: TWalletTransactionType
  ): Promise<number> {
    const filter: Record<string, string> = { walletId };
    if (type) filter.type = type;
    return walletTransactionDB.countDocuments(filter).exec();
  }

  async findAllSortedByDate(): Promise<IWalletTransactionEntity[]> {
    const docs = await walletTransactionDB
      .find()
      .sort({ createdAt: -1 })
      .exec();

    return docs.map((doc) => ({
      _id: String(doc._id),
      walletId: String(doc.walletId),
      type: doc.type,
      source: doc.source,
      referenceId: doc.referenceId,
      amount: doc.amount,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async findAllPaginated(
    page: number,
    limit: number,
    type?: IWalletTransactionEntity["type"],
    source?: IWalletTransactionEntity["source"],
    sortOrder?: TWalletTransactionSortOrder
  ): Promise<IWalletTransactionEntity[]> {
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (type) {
      filter.type = type;
    }
    if (source) {
      filter.source = source;
    }

    const sortDir = sortOrder === "oldest" ? 1 : -1;

    const docs = await walletTransactionDB
      .find(filter)
      .sort({ createdAt: sortDir })
      .skip(skip)
      .limit(limit)
      .exec();

    return docs.map((doc) => ({
      _id: String(doc._id),
      walletId: String(doc.walletId),
      type: doc.type,
      source: doc.source,
      referenceId: doc.referenceId,
      amount: doc.amount,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async countAll(
    type?: IWalletTransactionEntity["type"],
    source?: IWalletTransactionEntity["source"]
  ): Promise<number> {
    const filter: Record<string, unknown> = {};
    if (type) {
      filter.type = type;
    }
    if (source) {
      filter.source = source;
    }

    return walletTransactionDB.countDocuments(filter).exec();
  }

  async existsByReferenceIdAndSource(
    referenceId: string,
    source: IWalletTransactionEntity["source"]
  ): Promise<boolean> {
    const doc = await walletTransactionDB
      .findOne({ referenceId, source })
      .limit(1)
      .lean()
      .exec();
    return !!doc;
  }
}

