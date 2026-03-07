import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetAgencyProfileUsecase } from "../../../application/usecase/interfaces/agency/get-agency-profile.interface";
import { IUpdateAgencyProfileUsecase } from "../../../application/usecase/interfaces/agency/update-agency-profile.interface";
import { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";

@injectable()
export class AgencyProfileController {
  constructor(
    @inject("IGetAgencyProfileUsecase")
    private readonly _getAgencyProfileUsecase: IGetAgencyProfileUsecase,
    @inject("IUpdateAgencyProfileUsecase")
    private readonly _updateAgencyProfileUsecase: IUpdateAgencyProfileUsecase,
    @inject("IS3Service")
    private readonly _s3Service: IS3Service
  ) {}

  private async enrichProfileImageUrl(
    profileImage: string | null,
  ): Promise<string | null> {
    if (!profileImage || profileImage.startsWith("http")) {
      return profileImage;
    }
    try {
      const signedUrl = await this._s3Service.getSignedUrl(profileImage);
      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL for agency profile image:", error);
      return null;
    }
  }

  async getProfile(req: CustomRequest, res: Response): Promise<void> {
    console.log(req.user,"-->users");
    if (!req.user?.id) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const profile = await this._getAgencyProfileUsecase.execute(req.user.id);

    profile.profileImage = await this.enrichProfileImageUrl(
      profile.profileImage,
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.AGENCY.FETCHED,
      profile
    );
  }

  async updateProfile(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user?.id) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const updateData = req.body;

    const updatedProfile = await this._updateAgencyProfileUsecase.execute(
      req.user.id,
      updateData
    );

    updatedProfile.profileImage = await this.enrichProfileImageUrl(
      updatedProfile.profileImage,
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.AGENCY.PROFILE_UPDATED,
      updatedProfile
    );
  }
}
