import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants/constants";

@injectable()
export class AgencyUploadController {
  constructor(@inject("IS3Service") private _s3Service: IS3Service) {}

  async uploadProfileImage(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.INVALID_REQUEST,
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }

    try {
      const s3Key = await this._s3Service.uploadPrivateFile(
        req.file,
        "agency-profiles"
      );

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.AGENCY.PROFILE_UPDATED,
        { s3Key }
      );
    } catch (error) {
      console.error("Upload error:", error);
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.INVALID_REQUEST,
        HTTP_STATUS.BAD_REQUEST
      );
      return;
    }

    try {
      
      const imageUrl = await this._s3Service.uploadFile(
        req.file,
        "packages",
        true,
      );

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.PACKAGE.IMAGES_UPDATED,
        { url: imageUrl },
      );
    } catch (error) {
      console.error("Upload error:", error);
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadMultipleImages(req: Request, res: Response): Promise<void> {
    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.GENERAL.INVALID_REQUEST,
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
      
      // Upload as public
      const imageUrls = await this._s3Service.uploadMultipleFiles(
        files,
        "packages",
        true
      );

      ResponseHelper.success(
        res,
        HTTP_STATUS.OK,
        SUCCESS_MESSAGE.UPLOAD.SIGNED_URLS_GENERATED,
        { urls: imageUrls }
      );
    } catch (error) {
      console.error("Upload error:", error);
      ResponseHelper.error(
        res,
        ERROR_MESSAGE.UPLOAD.DOCUMENTS_UPLOAD_FAILED,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
