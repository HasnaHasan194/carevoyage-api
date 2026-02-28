import { inject, injectable } from "tsyringe";
import type { TWalletOwnerType } from "../../../../domain/entities/wallet.entity";
import type { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import type { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import type {
  IWalletOwnerDisplayService,
  WalletOwnerDisplayResult,
} from "../../interfaces/admin/wallet-owner-display.interface";

@injectable()
export class WalletOwnerDisplayService implements IWalletOwnerDisplayService {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository,
    @inject("IAgencyRepository")
    private readonly _agencyRepository: IAgencyRepository
  ) {}

  async getDisplay(
    ownerId: string,
    ownerType: TWalletOwnerType
  ): Promise<WalletOwnerDisplayResult> {
    if (ownerType === "USER") {
      const user = await this._userRepository.findById(ownerId);
      const ownerName = user
        ? `${user.firstName} ${user.lastName}`.trim()
        : undefined;
      return { ownerType: "client", ownerName };
    }

    if (ownerType === "AGENCY") {
      const agency = await this._agencyRepository.findById(ownerId);
      return {
        ownerType: "agency",
        ownerName: agency?.agencyName,
      };
    }

    if (ownerType === "ADMIN") {
      return { ownerType: "admin", ownerName: "Platform" };
    }

    return { ownerType: "admin" };
  }
}
