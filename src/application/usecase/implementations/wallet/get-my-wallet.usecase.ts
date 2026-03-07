import { inject, injectable } from "tsyringe";
import type { IWalletEntity } from "../../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../../domain/repositoryInterfaces/Wallet/wallet.repository.interface";
import { IGetMyWalletUseCase } from "../../interfaces/wallet/get-my-wallet.interface";
import type { IWalletOwnerResolver } from "../../interfaces/wallet/wallet-owner-resolver.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class GetMyWalletUseCase implements IGetMyWalletUseCase {
  constructor(
    @inject("IWalletRepository")
    private readonly _walletRepository: IWalletRepository,
    @inject("IWalletOwnerResolver")
    private readonly _walletOwnerResolver: IWalletOwnerResolver
  ) {}

  async execute(userId: string, role: string): Promise<IWalletEntity> {
    const owner = await this._walletOwnerResolver.resolve(userId, role);
    if (!owner) {
      throw new ValidationError(ERROR_MESSAGE.WALLET.UNSUPPORTED_ROLE);
    }

    const existing =
      (await this._walletRepository.findByOwner(owner.ownerId, owner.ownerType)) ?? null;
    if (existing) return existing;

    const now = new Date();
    return this._walletRepository.save({
      ownerId: owner.ownerId,
      ownerType: owner.ownerType,
      balance: 0,
      createdAt: now,
      updatedAt: now,
    });
  }
}

