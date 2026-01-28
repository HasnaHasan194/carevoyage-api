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

   
    const fs = require('fs');
    fs.appendFileSync('c:\\Users\\Hasna\\OneDrive\\Desktop\\CareVoyage\\.cursor\\debug.log', JSON.stringify({location:'user-profile.controller.ts:getProfile',message:'Profile from DB',data:{userId:req.user.id,profileImageFromDB:userEntity.profileImage?.substring(0,50),profileImageInDTO:profileDTO.profileImage?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'C'})+'\n');
   

    // If profileImage exists and is an S3 key , generate signed URL
    if (profileDTO.profileImage && !profileDTO.profileImage.startsWith("http")) {
      try {
        const signedUrl = await this.s3Service.getSignedUrl(profileDTO.profileImage);
        
        fs.appendFileSync('c:\\Users\\Hasna\\OneDrive\\Desktop\\CareVoyage\\.cursor\\debug.log', JSON.stringify({location:'user-profile.controller.ts:getProfile-signedUrl',message:'Generated signed URL',data:{originalKey:profileDTO.profileImage?.substring(0,50),signedUrlPrefix:signedUrl?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})+'\n');
       
        profileDTO.profileImage = signedUrl;
      } catch (error) {
        console.error("Error generating signed URL for profile image:", error);
      
        fs.appendFileSync('c:\\Users\\Hasna\\OneDrive\\Desktop\\CareVoyage\\.cursor\\debug.log', JSON.stringify({location:'user-profile.controller.ts:getProfile-error',message:'Signed URL generation failed',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'E'})+'\n');
      
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
    
      const fs = require('fs');
      fs.appendFileSync('c:\\Users\\Hasna\\OneDrive\\Desktop\\CareVoyage\\.cursor\\debug.log', JSON.stringify({location:'user-profile.controller.ts:updateProfile',message:'Update data received',data:{userId:req.user.id,updateDataKeys:Object.keys(updateData),hasProfileImage:'profileImage' in updateData,profileImageValue:updateData.profileImage?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})+'\n');
     
      const updatedUser = await this.updateUserProfileUsecase.execute(
        req.user.id,
        updateData
      );
     
      fs.appendFileSync('c:\\Users\\Hasna\\OneDrive\\Desktop\\CareVoyage\\.cursor\\debug.log', JSON.stringify({location:'user-profile.controller.ts:updateProfile-result',message:'Update result',data:{updatedProfileImage:updatedUser.profileImage?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})+'\n');
      

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
