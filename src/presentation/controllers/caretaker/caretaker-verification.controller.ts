import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { ISubmitCaretakerVerificationUsecase } from "../../../application/usecase/interfaces/caretaker/submit-verification.interface";
import { CaretakerVerificationRequestDTO } from "../../../application/dto/request/caretaker-verification-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
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
  
  private ensureAuthenticated(req: CustomRequest): string {
    if (!req.user) {
      throw new Error(ERROR_MESSAGE.AUTHENTICATION.USER_NOT_AUTHENTICATED);
    }
    return req.user.id;
  }

  private async attachSignedUrlIfNeeded(
    key: string | undefined,
  ): Promise<string | undefined> {
    if (!key || key.startsWith("http")) {
      return key;
    }
    try {
      return await this._s3Service.getSignedUrl(key);
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return undefined;
    }
  }

  async submitVerification(req: CustomRequest, res: Response): Promise<void> {
    const userId = this.ensureAuthenticated(req);

    const verificationData = req.body as CaretakerVerificationRequestDTO;
    console.log(verificationData,"------->c data")
    await this._submitVerificationUsecase.execute(
      userId,
      verificationData,
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CARETAKER.VERIFICATION_SUBMITTED,
    );
  }

  async getVerificationStatus(
    req: CustomRequest,
    res: Response,
  ): Promise<void> {
    const userId = this.ensureAuthenticated(req);

    const status = await this._caretakerProfileRepository.getVerificationStatus(
      userId,
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CARETAKER.VERIFICATION_STATUS_FETCHED,
      {
        verificationStatus: status,
        isVerified: status === "verified",
      },
    );
  }

  async getProfile(req: CustomRequest, res: Response): Promise<void> {
    const userId = this.ensureAuthenticated(req);

    try {
      const profileDTO = await this._getCaretakerProfileUsecase.execute(userId);

      profileDTO.profileImage = await this.attachSignedUrlIfNeeded(
        profileDTO.profileImage,
      );

      profileDTO.documents.caretakerLicense =
        (await this.attachSignedUrlIfNeeded(
          profileDTO.documents.caretakerLicense,
        )) ?? profileDTO.documents.caretakerLicense;

      profileDTO.documents.governmentIdProof =
        (await this.attachSignedUrlIfNeeded(
          profileDTO.documents.governmentIdProof,
        )) ?? profileDTO.documents.governmentIdProof;

      profileDTO.documents.firstAidCertificate =
        (await this.attachSignedUrlIfNeeded(
          profileDTO.documents.firstAidCertificate,
        )) ?? profileDTO.documents.firstAidCertificate;

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.CARETAKER.PROFILE_FETCHED,
        profileDTO,
      );
    } catch (error) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.CARETAKER.PROFILE_NOT_FOUND,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

