import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import type { IGetAllUsersUsecase } from "../../../application/usecase/interfaces/admin/getallusers.interface";
import type { IBlockUnblockUserUsecase } from "../../../application/usecase/interfaces/admin/blockUnblock.interface";
import type { IListWalletTransactionsUseCase } from "../../../application/usecase/interfaces/admin/list-wallet-transactions.interface";
import type { IAdminController } from "../../interfaces/controllers/admin/admin.controller.interface";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject("IGetAllUsersUsecase")
    private _getAllUsersUsecase: IGetAllUsersUsecase,

    @inject("IBlockUnblockUserUsecase")
    private _blockUnblockUserUsecase: IBlockUnblockUserUsecase,

    @inject("IListWalletTransactionsUseCase")
    private _listWalletTransactionsUseCase: IListWalletTransactionsUseCase
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await this._getAllUsersUsecase.execute(page, limit);

    res.status(200).json({
      success: true,
      data,
    });
  }

  async blockUnblockUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { isBlocked } = req.body as { isBlocked: boolean };

    await this._blockUnblockUserUsecase.execute(userId, isBlocked);

    res.status(200).json({
      success: true,
      message: "User status updated",
    });
  }

  async getWalletTransactions(req: Request, res: Response): Promise<void> {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const rawType = req.query.type as string | undefined;
    const rawSource = req.query.source as string | undefined;
    const rawSort = req.query.sort as string | undefined;

    const type: "CREDIT" | "DEBIT" | undefined =
      rawType === "CREDIT" || rawType === "DEBIT" ? rawType : undefined;
    const source: "PAYMENT" | "REFUND" | "COMMISSION" | undefined =
      rawSource === "PAYMENT" || rawSource === "REFUND" || rawSource === "COMMISSION"
        ? rawSource
        : undefined;
    const sort: "newest" | "oldest" =
      rawSort === "oldest" ? "oldest" : "newest";

    const data = await this._listWalletTransactionsUseCase.execute({
      page,
      limit,
      type,
      source,
      sort,
    });

    res.status(200).json({
      success: true,
      data,
    });
  }
}
