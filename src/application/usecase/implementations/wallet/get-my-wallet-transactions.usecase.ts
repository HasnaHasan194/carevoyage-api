import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet.repository.interface";
import { IWalletTransactionRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet-transaction.repository.interface";
import type {
  IGetMyWalletTransactionsUseCase,
  GetMyWalletTransactionsParams,
} from "../../interfaces/wallet/get-my-wallet-transactions.interface";
import type { IWalletOwnerResolver } from "../../interfaces/wallet/wallet-owner-resolver.interface";
import type { PaginatedWalletTransactionsResponseDTO } from "../../../dto/response/wallet-response.dto";
import { ValidationError } from "../../../../domain/errors/validationError";

const emptyPaginated = (
  page: number,
  limit: number
): PaginatedWalletTransactionsResponseDTO => ({
  transactions: [],
  total: 0,
  page,
  limit,
  totalPages: 0,
});

@injectable()
export class GetMyWalletTransactionsUseCase
  implements IGetMyWalletTransactionsUseCase
{
  constructor(
    @inject("IWalletRepository")
    private readonly _walletRepository: IWalletRepository,
    @inject("IWalletTransactionRepository")
    private readonly _walletTransactionRepository: IWalletTransactionRepository,
    @inject("IWalletOwnerResolver")
    private readonly _walletOwnerResolver: IWalletOwnerResolver
  ) {}

  async execute(
    params: GetMyWalletTransactionsParams
  ): Promise<PaginatedWalletTransactionsResponseDTO> {
    const { userId, role, page, limit, type, sort } = params;

    const owner = await this._walletOwnerResolver.resolve(userId, role);
    if (!owner) {
      throw new ValidationError(
        "Wallet transactions are not available for this role"
      );
    }

    const wallet =
      (await this._walletRepository.findByOwner(owner.ownerId, owner.ownerType)) ?? null;
    if (!wallet) {
      return emptyPaginated(page, limit);
    }

    const typeFilter = type && type !== "all" ? type : undefined;

    const [transactions, total] = await Promise.all([
      this._walletTransactionRepository.findByWalletIdPaginated(
        wallet._id,
        page,
        limit,
        typeFilter,
        sort
      ),
      this._walletTransactionRepository.countByWalletId(wallet._id, typeFilter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      transactions: transactions.map((tx) => ({
        id: tx._id,
        walletId: tx.walletId,
        type: tx.type,
        source: tx.source,
        referenceId: tx.referenceId,
        amount: tx.amount,
        description: tx.description,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }
}

