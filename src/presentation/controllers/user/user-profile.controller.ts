import { inject, injectable } from "tsyringe";
import { Response } from "express";
import { HTTP_STATUS } from "../../../shared/constants/constants";
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

  async getProfile(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const userEntity = await this.getUserProfileUsecase.execute(req.user.id);
    const profileDTO = UserProfileMapper.toDTO(userEntity);

   
 

    // If profileImage exists and is an S3 key , generate signed URL
    if (profileDTO.profileImage && !profileDTO.profileImage.startsWith("http")) {
      try {
        const signedUrl = await this.s3Service.getSignedUrl(profileDTO.profileImage);
        
      
       
        profileDTO.profileImage = signedUrl;
      } catch (error) {
        console.error("Error generating signed URL for profile image:", error);
      
       
        // Continue without profile image if signed URL generation fails
        profileDTO.profileImage = undefined;
      }
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: profileDTO,
    });
  }

  async updateProfile(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        "Unauthorized",
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

      // If profileImage exists and is an S3 key (not a URL), generate signed URL
      if (profileDTO.profileImage && !profileDTO.profileImage.startsWith("http")) {
        try {
          const signedUrl = await this.s3Service.getSignedUrl(profileDTO.profileImage);
          profileDTO.profileImage = signedUrl;
        } catch (error) {
          console.error("Error generating signed URL for profile image:", error);
          profileDTO.profileImage = undefined;
        }
      }

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        "Profile updated successfully",
        profileDTO
      );
    } catch (error: any) {
      console.error("Error updating profile:", error);
      ResponseHelper.error(
        res,
        error.message || "Failed to update profile",
        error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
