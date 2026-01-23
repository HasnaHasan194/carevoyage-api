export interface IS3Service {
 
  uploadFile(
    file: Express.Multer.File,
    folder?: string,
    isPublic?: boolean
  ): Promise<string>;
  
 
  uploadPrivateFile(
    file: Express.Multer.File,
    folder?: string
  ): Promise<string>; 
  
  deleteFile(fileUrl: string): Promise<void>;
  
  uploadMultipleFiles(
    files: Express.Multer.File[],
    folder?: string,
    isPublic?: boolean
  ): Promise<string[]>;
  
  uploadMultiplePrivateFiles(
    files: Express.Multer.File[],
    folder?: string
  ): Promise<string[]>; 
  getSignedUrl(
    s3Key: string,
    expiresIn?: number 
  ): Promise<string>;
  
  
  getSignedUrls(
    s3Keys: string[],
    expiresIn?: number
  ): Promise<string[]>;
}

