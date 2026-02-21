import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAddToWishlistUsecase } from "../../../application/usecase/interfaces/wishlist/add-to-wishlist.interface";
import { IRemoveFromWishlistUsecase } from "../../../application/usecase/interfaces/wishlist/remove-from-wishlist.interface";
import { IGetWishlistUsecase } from "../../../application/usecase/interfaces/wishlist/get-wishlist.interface";
import { ICheckWishlistStatusUsecase } from "../../../application/usecase/interfaces/wishlist/check-wishlist-status.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import { IWishlistController } from "../../interfaces/controllers/user/wishlist.controller.interface";

@injectable()
export class WishlistController implements IWishlistController {
  constructor(
    @inject("IAddToWishlistUsecase")
    private readonly addToWishlistUsecase: IAddToWishlistUsecase,
    @inject("IRemoveFromWishlistUsecase")
    private readonly removeFromWishlistUsecase: IRemoveFromWishlistUsecase,
    @inject("IGetWishlistUsecase")
    private readonly getWishlistUsecase: IGetWishlistUsecase,
    @inject("ICheckWishlistStatusUsecase")
    private readonly checkWishlistStatusUsecase: ICheckWishlistStatusUsecase
  ) {}

  async addToWishlist(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        "Unauthorized",
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    try {
      const { packageId } = req.body as { packageId: string };

      const wishlistItem = await this.addToWishlistUsecase.execute(
        req.user.id,
        packageId
      );

      ResponseHelper.success(
        res,
        HTTP_STATUS.CREATED,
        SUCCESS_MESSAGE.WISHLIST.ADDED,
        wishlistItem
      );
    } catch (error: any) {
      ResponseHelper.error(
        res,
        error.message || "Failed to add package to bucket list",
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async removeFromWishlist(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        "Unauthorized",
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    try {
      const { packageId } = req.params;

      if (!packageId) {
        ResponseHelper.error(
          res,
          "Package ID is required",
          HTTP_STATUS.BAD_REQUEST
        );
        return;
      }

      await this.removeFromWishlistUsecase.execute(req.user.id, packageId);

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.WISHLIST.REMOVED,
        null
      );
    } catch (error: any) {
      ResponseHelper.error(
        res,
        error.message || "Failed to remove package from bucket list",
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getWishlist(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        "Unauthorized",
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    try {
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const result = await this.getWishlistUsecase.execute(req.user.id, page, limit);

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.WISHLIST.FETCHED,
        result
      );
    } catch (error: any) {
      ResponseHelper.error(
        res,
        error.message || "Failed to fetch bucket list",
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async checkWishlistStatus(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        "Unauthorized",
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    try {
      const { packageId } = req.params;

      if (!packageId) {
        ResponseHelper.error(
          res,
          "Package ID is required",
          HTTP_STATUS.BAD_REQUEST
        );
        return;
      }

      const isInWishlist = await this.checkWishlistStatusUsecase.execute(
        req.user.id,
        packageId
      );

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        "Wishlist status checked successfully",
        { isInWishlist }
      );
    } catch (error: any) {
      ResponseHelper.error(
        res,
        error.message || "Failed to check wishlist status",
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
