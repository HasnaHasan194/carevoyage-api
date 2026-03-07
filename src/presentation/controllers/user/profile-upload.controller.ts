import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class ProfileUploadController {
  constructor(@inject("IS3Service") private _s3Service: IS3Service) {}

  /**
   * Upload profile image 
   */
  async uploadProfileImage(req: CustomRequest, res: Response): Promise<void> {
    if (!req.file) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.UPLOAD.NO_FILE_UPLOADED,
        HTTP_STATUS.BAD_REQUEST
        
      );
      return;
    }

    try {
      // Upload as private
      const s3Key = await this._s3Service.uploadPrivateFile(req.file, "profiles");

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.UPLOAD.PROFILE_IMAGE_UPLOADED,
        { s3Key } 
      );
    } catch (error) {
      console.error("Upload error:", error);
      ResponseHelper.error(
        res,
          ERROR_MESSAGE.UPLOAD.PROFILE_UPLOAD_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        
      );
    }
  }

  /**
   * Upload documents/KYC docs (PRIVATE)
   */
  async uploadDocuments(req: CustomRequest, res: Response): Promise<void> {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.UPLOAD.NO_FILES_UPLOADED,
        HTTP_STATUS.BAD_REQUEST
        
      );
      return;
    }

    try {
      // Handle both array and object formats from multer
      let files: Express.Multer.File[];
      if (Array.isArray(req.files)) {
        files = req.files;
      } else {
        // Extract all files from all fields and flatten into a single array
        files = Object.values(req.files).flat();
      }
      
      const folder = (req.query.folder as string) || "documents"; 
      
      // Upload as private
      const s3Keys = await this._s3Service.uploadMultiplePrivateFiles(files, folder);

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.UPLOAD.DOCUMENTS_UPLOADED,
        { s3Keys }
      );
    } catch (error) {
      console.error("Upload error:", error);
      ResponseHelper.error(
        res,
           ERROR_MESSAGE.UPLOAD.DOCUMENTS_UPLOAD_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
       
      );
    }
  }

  /**
   * Get signed URL for private image/document
   */
  async getSignedUrl(req: CustomRequest, res: Response): Promise<void> {
    const { s3Key } = req.query;

    if (!s3Key || typeof s3Key !== "string") {
      ResponseHelper.error(
        res,
          ERROR_MESSAGE.UPLOAD.S3_KEY_REQUIRED,
        HTTP_STATUS.BAD_REQUEST,
      
      );
      return;
    }

    try {
      const expiresIn = Number(req.query.expiresIn) || 3600; 
      const signedUrl = await this._s3Service.getSignedUrl(s3Key, expiresIn);

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.UPLOAD.SIGNED_URL_GENERATED,
        { url: signedUrl, expiresIn }
      );
    } catch (error) {
      console.error("Error generating signed URL:", error);
      ResponseHelper.error(
        res,
         ERROR_MESSAGE.UPLOAD.SIGNED_URL_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
       
      );
    }
  }

  /**
   * Get multiple signed URLs
   */
  async getSignedUrls(req: CustomRequest, res: Response): Promise<void> {
    const { s3Keys } = req.body;

    if (!Array.isArray(s3Keys) || s3Keys.length === 0) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.UPLOAD.S3_KEYS_REQUIRED,
        HTTP_STATUS.BAD_REQUEST
        
      );
      return;
    }

    try {
      const expiresIn = Number(req.body.expiresIn) || 3600;
      const signedUrls = await this._s3Service.getSignedUrls(s3Keys, expiresIn);

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.UPLOAD.SIGNED_URLS_GENERATED,
        { urls: signedUrls, expiresIn }
      );
    } catch (error) {
      console.error("Error generating signed URLs:", error);
      ResponseHelper.error(
        res,
         ERROR_MESSAGE.UPLOAD.SIGNED_URLS_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
       
      );
    }
  }
}


