import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import { IGetMyWalletUseCase } from "../../../application/usecase/interfaces/wallet/get-my-wallet.interface";
import { IGetMyWalletTransactionsUseCase } from "../../../application/usecase/interfaces/wallet/get-my-wallet-transactions.interface";
import type { ICreateWalletTopupCheckoutUseCase } from "../../../application/usecase/interfaces/wallet/create-wallet-topup-checkout.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";

@injectable()
export class WalletController {
  constructor(
    @inject("IGetMyWalletUseCase")
    private readonly _getMyWalletUseCase: IGetMyWalletUseCase,
    @inject("IGetMyWalletTransactionsUseCase")
    private readonly _getMyWalletTransactionsUseCase: IGetMyWalletTransactionsUseCase,
    @inject("ICreateWalletTopupCheckoutUseCase")
    private readonly _createWalletTopupCheckoutUseCase: ICreateWalletTopupCheckoutUseCase
  ) {}

  async getMyWallet(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const wallet = await this._getMyWalletUseCase.execute(
      req.user.id,
      req.user.role
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.WALLET.BALANCE_FETCHED,
      wallet
    );
  }

  async getMyTransactions(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const rawType = req.query.type as string | undefined;
    const rawSort = req.query.sort as string | undefined;

    const type =
      rawType === "CREDIT" || rawType === "DEBIT" || rawType === "all"
        ? rawType
        : "all";
    const sort =
      rawSort === "newest" || rawSort === "oldest" ? rawSort : "newest";

    const transactions =
      await this._getMyWalletTransactionsUseCase.execute({
        userId: req.user.id,
        role: req.user.role,
        page,
        limit,
        type,
        sort,
      });

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.WALLET.TRANSACTIONS_FETCHED,
      transactions
    );
  }

  async createTopupCheckout(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    // Client-only topups (per requirements).
    if (req.user.role !== "client") {
      ResponseHelper.error(res, ERROR_MESSAGE.GENERAL.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
      return;
    }

    const amount = Number((req.body as { amount?: number }).amount);
    const result = await this._createWalletTopupCheckoutUseCase.execute(req.user.id, amount);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Wallet top-up checkout created",
      result
    );
  }
}

