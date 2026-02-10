import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { ISubmitCaretakerVerificationUsecase } from "../../../application/usecase/interfaces/caretaker/submit-verification.interface";
import { CaretakerVerificationRequestDTO } from "../../../application/dto/request/caretaker-verification-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IGetCaretakerProfileUsecase } from "../../../application/usecase/interfaces/caretaker/get-caretaker-profile.interface";
import { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";

@injectable()
export class CaretakerVerificationController {
  constructor(
    @inject("ISubmitCaretakerVerificationUsecase")
    private _submitVerificationUsecase: ISubmitCaretakerVerificationUsecase,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IGetCaretakerProfileUsecase")
    private _getCaretakerProfileUsecase: IGetCaretakerProfileUsecase,
    @inject("IS3Service")
    private _s3Service: IS3Service,
  ) {}
  
  async submitVerification(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        "User not authenticated",
        HTTP_STATUS.UNAUTHORIZED,
      );
      return;
    }

    const verificationData = req.body as CaretakerVerificationRequestDTO;
    console.log(verificationData,"------->c data")
    await this._submitVerificationUsecase.execute(
      req.user.id,
      verificationData,
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Verification submitted successfully. Your profile is under review.",
    );
  }

  async getVerificationStatus(
    req: CustomRequest,
    res: Response,
  ): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        "User not authenticated",
        HTTP_STATUS.UNAUTHORIZED,
      );
      return;
    }

    const status = await this._caretakerProfileRepository.getVerificationStatus(
      req.user.id,
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Verification status retrieved successfully",
      {
        verificationStatus: status,
        isVerified: status === "verified",
      },
    );
  }

  async getProfile(req: CustomRequest, res: Response): Promise<void> {
    if (!req.user) {
      ResponseHelper.error(
        res,
        "User not authenticated",
        HTTP_STATUS.UNAUTHORIZED,
      );
      return;
    }

    try {
      const profileDTO = await this._getCaretakerProfileUsecase.execute(req.user.id);

      // Generate signed URLs for profile image and documents =>(if they're S3 keys)
      if (profileDTO.profileImage && !profileDTO.profileImage.startsWith("http")) {
        try {
          profileDTO.profileImage = await this._s3Service.getSignedUrl(profileDTO.profileImage);
        } catch (error) {
          console.error("Error generating signed URL for profile image:", error);
          profileDTO.profileImage = undefined;
        }
      }

      // Generate signed URLs for documents
      if (profileDTO.documents.caretakerLicense && !profileDTO.documents.caretakerLicense.startsWith("http")) {
        try {
          profileDTO.documents.caretakerLicense = await this._s3Service.getSignedUrl(profileDTO.documents.caretakerLicense);
        } catch (error) {
          console.error("Error generating signed URL for caretaker license:", error);
        }
      }

      if (profileDTO.documents.governmentIdProof && !profileDTO.documents.governmentIdProof.startsWith("http")) {
        try {
          profileDTO.documents.governmentIdProof = await this._s3Service.getSignedUrl(profileDTO.documents.governmentIdProof);
        } catch (error) {
          console.error("Error generating signed URL for government ID proof:", error);
        }
      }

      if (profileDTO.documents.firstAidCertificate && !profileDTO.documents.firstAidCertificate.startsWith("http")) {
        try {
          profileDTO.documents.firstAidCertificate = await this._s3Service.getSignedUrl(profileDTO.documents.firstAidCertificate);
        } catch (error) {
          console.error("Error generating signed URL for first aid certificate:", error);
        }
      }

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        "Profile retrieved successfully",
        profileDTO,
      );
    } catch (error) {
      ResponseHelper.error(
        res,
        (error as Error).message || "Failed to retrieve profile",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

