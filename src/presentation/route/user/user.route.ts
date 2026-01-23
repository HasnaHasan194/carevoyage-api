import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  blockedUserMiddleware,
  userController,
  profileUploadController,
} from "../../../infrastructure/dependencyinjection/resolve";
import multer from "multer";

@injectable()
export class UserRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use(verifyAuth);
    this.router.use(blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware));

    this.router.get(
      "/profile",
      asyncHandler(userController.getProfile.bind(userController))
    );

    // File upload configuration
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new Error("Only image files are allowed"));
        }
      },
    });

    const documentUpload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for documents
    });

    // Profile image upload (PRIVATE)
    this.router.post(
      "/upload/profile-image",
      upload.single("image"),
      asyncHandler(
        profileUploadController.uploadProfileImage.bind(profileUploadController)
      )
    );

    // Documents/KYC upload (PRIVATE)
    this.router.post(
      "/upload/documents",
      documentUpload.array("documents", 10),
      asyncHandler(
        profileUploadController.uploadDocuments.bind(profileUploadController)
      )
    );

    // Get signed URL for private image/document
    this.router.get(
      "/signed-url",
      asyncHandler(
        profileUploadController.getSignedUrl.bind(profileUploadController)
      )
    );

    // Get multiple signed URLs
    this.router.post(
      "/signed-urls",
      asyncHandler(
        profileUploadController.getSignedUrls.bind(profileUploadController)
      )
    );
  }
}
