import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAdminUserController } from "../../interfaces/controllers/admin/admin-user.controller.interface";
import { IGetAllUsersUsecase } from "../../../application/usecase/interfaces/admin/getallusers.interface";
import { IGetUserDetailsUsecase } from "../../../application/usecase/interfaces/admin/get-user-details.interface";
import { IBlockUnblockUserUsecase } from "../../../application/usecase/interfaces/admin/blockUnblock.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";

@injectable()
export class AdminUserController implements IAdminUserController {
  constructor(
    @inject("IGetAllUsersUsecase")
    private _getAllUsersUsecase: IGetAllUsersUsecase,

    @inject("IGetUserDetailsUsecase")
    private _getUserDetailsUsecase: IGetUserDetailsUsecase,

    @inject("IBlockUnblockUserUsecase")
    private _blockUnblockUserUsecase: IBlockUnblockUserUsecase
  ) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;
    const status = (req.query.status as "all" | "blocked" | "unblocked") || "all";
    const sort = (req.query.sort as string) || "createdAt";
    const order = (req.query.order as "asc" | "desc") || "asc";

    const result = await this._getAllUsersUsecase.execute(
      page,
      limit,
      search,
      status,
      sort,
      order
    );

    ResponseHelper.success(res, HTTP_STATUS.OK, "Users retrieved successfully", result);
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    const user = await this._getUserDetailsUsecase.execute(userId);

    ResponseHelper.success(res, HTTP_STATUS.OK, "User details retrieved successfully", user);
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    await this._blockUnblockUserUsecase.execute(userId, true);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.AUTHORIZATION.USER_BLOCKED || "User blocked successfully"
    );
  }

  async unblockUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    await this._blockUnblockUserUsecase.execute(userId, false);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.AUTHORIZATION.USER_UNBLOCKED || "User unblocked successfully"
    );
  }
}




