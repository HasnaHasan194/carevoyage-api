import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { injectable } from "tsyringe";
import { IS3Service } from "../../domain/service-interfaces/s3-service.interface";
import { v4 as uuidv4 } from "uuid";
import path from "path";

@injectable()
export class S3Service implements IS3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || "us-east-1";
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || "";

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error(
        "AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
      );
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Upload file (public or private based on isPublic flag)
   * @param file - File to upload
   * @param folder - S3 folder path
   * @param isPublic - If true, returns public URL; if false, returns S3 key for private access
   * @returns Public URL if isPublic=true, S3 key if isPublic=false
   * Note: ACLs are not used. Public access is controlled via bucket policy.
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = "packages",
    isPublic: boolean = true
  ): Promise<string> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      
    };

    await this.s3Client.send(new PutObjectCommand(uploadParams));

    
    if (isPublic) {
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
    } else {
      return fileName; 
    }
  }

  /**
   * Upload private file (for profile images, documents, etc.)
   * @param file - File to upload
   * @param folder - S3 folder path
   * @returns S3 key 
   */
  async uploadPrivateFile(
    file: Express.Multer.File,
    folder: string = "profiles"
  ): Promise<string> {
    return this.uploadFile(file, folder, false);
  }

  /**
   * Upload multiple files (public or private)
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = "packages",
    isPublic: boolean = true
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder, isPublic));
    return Promise.all(uploadPromises);
  }

  /**
   * Upload multiple private files
   */
  async uploadMultiplePrivateFiles(
    files: Express.Multer.File[],
    folder: string = "profiles"
  ): Promise<string[]> {
    return this.uploadMultipleFiles(files, folder, false);
  }

  /**
   * Generate signed URL for private image/document
   * @param s3Key - 
   * @param expiresIn 
   * @returns Signed URL
   */
  async getSignedUrl(
    s3Key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return signedUrl;
  }

  /**
   * Generate multiple signed URLs
   */
  async getSignedUrls(
    s3Keys: string[],
    expiresIn: number = 3600
  ): Promise<string[]> {
    const signedUrlPromises = s3Keys.map((key) => this.getSignedUrl(key, expiresIn));
    return Promise.all(signedUrlPromises);
  }

  /**
   * Extract S3 key from URL (for both public and private URLs)
   */
  private extractS3Key(urlOrKey: string): string {
    
    if (!urlOrKey.startsWith("http")) {
      return urlOrKey;
    }

    // Extract key from URL
    const urlParts = urlOrKey.split(".com/");
    if (urlParts.length < 2) {
      throw new Error("Invalid S3 URL format");
    }
    return urlParts[1];
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = this.extractS3Key(fileUrl);

      const deleteParams = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw error;
    }
  }
}

