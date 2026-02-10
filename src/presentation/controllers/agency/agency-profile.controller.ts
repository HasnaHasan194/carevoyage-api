import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IGetAgencyProfileUsecase } from "../../../application/usecase/interfaces/agency/get-agency-profile.interface";
import { IUpdateAgencyProfileUsecase } from "../../../application/usecase/interfaces/agency/update-agency-profile.interface";
import { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";

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

  async getProfile(req: CustomRequest, res: Response): Promise<void> {
    console.log(req.user,"-->users");
    if (!req.user?.id) {
      ResponseHelper.error(
        res,
        "Unauthorized",
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const profile = await this._getAgencyProfileUsecase.execute(req.user.id);

    if (profile.profileImage && !profile.profileImage.startsWith("http")) {
      try {
        const signedUrl = await this._s3Service.getSignedUrl(profile.profileImage);
        profile.profileImage = signedUrl;
      } catch (error) {
        console.error("Error generating signed URL for agency profile image:", error);
        profile.profileImage = null;
      }
    }

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Agency profile retrieved successfully",
      profile
    );
  }

  async updateProfile(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user?.id) {
      ResponseHelper.error(
        res,
        "Unauthorized",
        HTTP_STATUS.UNAUTHORIZED
      );
      return;
    }

    const updateData = req.body;

    const updatedProfile = await this._updateAgencyProfileUsecase.execute(
      req.user.id,
      updateData
    );

    if (updatedProfile.profileImage && !updatedProfile.profileImage.startsWith("http")) {
      try {
        const signedUrl = await this._s3Service.getSignedUrl(updatedProfile.profileImage);
        updatedProfile.profileImage = signedUrl;
      } catch (error) {
        console.error("Error generating signed URL for agency profile image:", error);
        updatedProfile.profileImage = null;
      }
    }

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.AGENCY.PROFILE_UPDATED,
      updatedProfile
    );
  }
}
