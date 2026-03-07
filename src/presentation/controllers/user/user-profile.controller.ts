import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetUserProfileUsecase } from "../../../application/usecase/interfaces/user/get-user-profile-usecase.interface";
import { IUpdateUserProfileUsecase } from "../../../application/usecase/interfaces/user/update-user-profile.interface";
import { UserProfileMapper } from "../../../application/mapper/user-profile.mapper";
import { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";

@injectable()
export class UserController {
  constructor(
    @inject("IGetUserProfileUsecase")
    private readonly getUserProfileUsecase: IGetUserProfileUsecase,
    @inject("IUpdateUserProfileUsecase")
    private readonly updateUserProfileUsecase: IUpdateUserProfileUsecase,
    @inject("IS3Service")
    private readonly s3Service: IS3Service
  ) {}

  private async enrichProfileImageUrl(
    profileImage: string | null | undefined,
  ): Promise<string | undefined> {
    if (!profileImage || profileImage.startsWith("http")) {
      return profileImage ?? undefined;
    }
    try {
      return await this.s3Service.getSignedUrl(profileImage);
    } catch (error) {
      console.error("Error generating signed URL for profile image:", error);
      return undefined;
    }
  }

  async getProfile(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
      });
      return;
    }

    const userEntity = await this.getUserProfileUsecase.execute(req.user.id);
    const profileDTO = UserProfileMapper.toDTO(userEntity);

    profileDTO.profileImage = await this.enrichProfileImageUrl(
      profileDTO.profileImage,
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: profileDTO,
    });
  }

  async updateProfile(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    try {
      const updateData = req.body;

      const updatedUser = await this.updateUserProfileUsecase.execute(
        req.user.id,
        updateData
      );

      const profileDTO = UserProfileMapper.toDTO(updatedUser);

      profileDTO.profileImage = await this.enrichProfileImageUrl(
        profileDTO.profileImage,
      );

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.USER.PROFILE_UPDATED,
        profileDTO
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof Error) {
        ResponseHelper.error(
          res,
          error.message,
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      } else {
        ResponseHelper.error(
          res,
          "Failed to update profile",
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
