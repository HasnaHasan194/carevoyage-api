import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IS3Service } from "../../../domain/service-interfaces/s3-service.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS } from "../../../shared/constants/constants";
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
        "No file uploaded",
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
        "Profile image uploaded successfully",
        { s3Key } 
      );
    } catch (error) {
      console.error("Upload error:", error);
      ResponseHelper.error(
        res,
        "Failed to upload profile image",
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
        "No files uploaded",
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
        "Documents uploaded successfully",
        { s3Keys }
      );
    } catch (error) {
      console.error("Upload error:", error);
      ResponseHelper.error(
        res,
         "Failed to upload documents",
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
          "S3 key is required",
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
        "Signed URL generated successfully",
        { url: signedUrl, expiresIn }
      );
    } catch (error) {
      console.error("Error generating signed URL:", error);
      ResponseHelper.error(
        res,
         "Failed to generate signed URL",
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
        "Array of S3 keys is required",
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
        "Signed URLs generated successfully",
        { urls: signedUrls, expiresIn }
      );
    } catch (error) {
      console.error("Error generating signed URLs:", error);
      ResponseHelper.error(
        res,
         "Failed to generate signed URLs",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
       
      );
    }
  }
}


