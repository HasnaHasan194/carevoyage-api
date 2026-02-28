import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { config } from "../../../../shared/config";
import type {
  IWalletOwnerResolver,
  WalletOwnerResult,
} from "../../interfaces/wallet/wallet-owner-resolver.interface";

@injectable()
export class WalletOwnerResolver implements IWalletOwnerResolver {
  constructor(
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository
  ) {}

  async resolve(userId: string, role: string): Promise<WalletOwnerResult | null> {
    if (role === "client") {
      return { ownerId: userId, ownerType: "USER" };
    }

    if (role === "agency_owner") {
      const agency = await this._agencyRepository.findByUserId(userId);
      if (!agency) return null;
      return { ownerId: agency._id, ownerType: "AGENCY" };
    }

    if (role === "admin") {
      return {
        ownerId: config.wallet.ADMIN_WALLET_OWNER_ID,
        ownerType: "ADMIN",
      };
    }

    return null;
  }
}
