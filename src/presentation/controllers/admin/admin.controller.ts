import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IGetAllUsersUsecase } from "../../../application/usecase/interfaces/admin/getallusers.interface";
import { IBlockUnblockUserUsecase } from "../../../application/usecase/interfaces/admin/blockUnblock.interface";

@injectable()
export class AdminController {
  constructor(
    @inject("IGetAllUsersUsecase")
    private _getAllUsersUsecase: IGetAllUsersUsecase,

    @inject("IBlockUnblockUserUsecase")
    private _blockUnblockUserUsecase: IBlockUnblockUserUsecase
  ) {}

  async getAllUsers(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await this._getAllUsersUsecase.execute(page, limit);

    res.status(200).json({
      success: true,
      data,
    });
  }

  async blockUnblockUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    await this._blockUnblockUserUsecase.execute(userId, isBlocked);

    res.status(200).json({
      success: true,
      message: "User status updated",
    });
  }
}
