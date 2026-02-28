import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import { blockedUserMiddleware, walletController } from "../../../infrastructure/dependencyinjection/resolve";

@injectable()
export class WalletRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use(verifyAuth);
    this.router.use(
      blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware)
    );

    this.router.get(
      "/me",
      asyncHandler(walletController.getMyWallet.bind(walletController))
    );

    this.router.get(
      "/me/transactions",
      asyncHandler(walletController.getMyTransactions.bind(walletController))
    );
  }
}

