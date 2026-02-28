import { inject, injectable } from "tsyringe";
import type {
  IListWalletTransactionsUseCase,
  ListWalletTransactionsParams,
} from "../interfaces/admin/list-wallet-transactions.interface";
import type {
  PaginatedAdminWalletTransactionsResponseDTO,
  AdminWalletTransactionViewDTO,
} from "../../dto/response/wallet-response.dto";
import type { IWalletTransactionRepository } from "../../../domain/repositoryInterfaces/Wallet/wallet-transaction.repository.interface";
import type { IWalletRepository } from "../../../domain/repositoryInterfaces/Wallet/wallet.repository.interface";
import type { IWalletOwnerDisplayService } from "../interfaces/admin/wallet-owner-display.interface";
import type {
  TWalletTransactionType,
  TWalletTransactionSource,
} from "../../../domain/entities/wallet-transaction.entity";

@injectable()
export class ListWalletTransactionsUseCase
  implements IListWalletTransactionsUseCase
{
  constructor(
    @inject("IWalletTransactionRepository")
    private readonly _walletTransactionRepository: IWalletTransactionRepository,
    @inject("IWalletRepository")
    private readonly _walletRepository: IWalletRepository,
    @inject("IWalletOwnerDisplayService")
    private readonly _walletOwnerDisplayService: IWalletOwnerDisplayService
  ) {}

  async execute(
    params: ListWalletTransactionsParams
  ): Promise<PaginatedAdminWalletTransactionsResponseDTO> {
    const { page, limit, type, source, sort } = params;

    const [transactions, total] = await Promise.all([
      this._walletTransactionRepository.findAllPaginated(
        page,
        limit,
        type,
        source,
        sort
      ),
      this._walletTransactionRepository.countAll(type, source),
    ]);

    const views: AdminWalletTransactionViewDTO[] = [];

    for (const tx of transactions) {
      const wallet = await this._walletRepository.findById(tx.walletId);
      if (!wallet) {
        continue;
      }

      const display = await this._walletOwnerDisplayService.getDisplay(
        wallet.ownerId,
        wallet.ownerType
      );

      views.push({
        transaction: {
          id: tx._id,
          walletId: tx.walletId,
          type: tx.type,
          source: tx.source,
          referenceId: tx.referenceId,
          amount: tx.amount,
          description: tx.description,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
        },
        ownerType: display.ownerType,
        ownerId: wallet.ownerId,
        ownerName: display.ownerName,
      });
    }

    const totalPages = Math.ceil(total / limit);

    return {
      transactions: views,
      total,
      page,
      limit,
      totalPages,
    };
  }
}

