import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  blockedUserMiddleware,
  userController,
  profileUploadController,
  wishlistController,
  reviewController,
} from "../../../infrastructure/dependencyinjection/resolve";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { authorizeRole } from "../../middlewares/auth.middleware";
import { UpdateUserProfileRequestDTO } from "../../../application/dto/request/update-user-profile-request.dto";
import { AddToWishlistRequestDTO } from "../../../application/dto/request/add-to-wishlist-request.dto";
import { CreateAgencyReviewRequestDTO } from "../../../application/dto/request/create-agency-review-request.dto";
import multer from "multer";
import { ROUTES } from "../routes.constants";

@injectable()
export class UserRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use(verifyAuth);
    this.router.use(blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware));

    this.router.get(
      ROUTES.USER.PROFILE,
      asyncHandler(userController.getProfile.bind(userController))
    );

    this.router.put(
      ROUTES.USER.PROFILE,
      validationMiddleware(UpdateUserProfileRequestDTO),
      asyncHandler(userController.updateProfile.bind(userController))
    );

    
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, 
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
      limits: { fileSize: 10 * 1024 * 1024 }, 
    });

    
    this.router.post(
      ROUTES.USER.UPLOAD_PROFILE_IMAGE,
      upload.single("image"),
      asyncHandler(
        profileUploadController.uploadProfileImage.bind(profileUploadController)
      )
    );

    // Documents/KYC upload 
    this.router.post(
      ROUTES.USER.UPLOAD_DOCUMENTS,
      documentUpload.array("documents", 10),
      asyncHandler(
        profileUploadController.uploadDocuments.bind(profileUploadController)
      )
    );

    
    this.router.get(
      ROUTES.USER.SIGNED_URL,
      asyncHandler(
        profileUploadController.getSignedUrl.bind(profileUploadController)
      )
    );

    // Get multiple signed URLs
    this.router.post(
      ROUTES.USER.SIGNED_URLS,
      asyncHandler(
        profileUploadController.getSignedUrls.bind(profileUploadController)
      )
    );

    // Wishlist/Bucket List Routes
    this.router.post(
      ROUTES.USER.WISHLIST_BASE,
      validationMiddleware(AddToWishlistRequestDTO),
      asyncHandler(wishlistController.addToWishlist.bind(wishlistController))
    );

    this.router.delete(
      ROUTES.USER.WISHLIST_DETAIL,
      asyncHandler(
        wishlistController.removeFromWishlist.bind(wishlistController)
      )
    );

    this.router.get(
      ROUTES.USER.WISHLIST_BASE,
      asyncHandler(wishlistController.getWishlist.bind(wishlistController))
    );

    this.router.get(
      ROUTES.USER.WISHLIST_STATUS,
      asyncHandler(
        wishlistController.checkWishlistStatus.bind(wishlistController)
      )
    );

    // Client agency review (submit review for a completed booking)
    // Path must match frontend: POST /api/v1/user/agency-reviews
    this.router.post(
      "/agency-reviews",
      authorizeRole(["client"]),
      validationMiddleware(CreateAgencyReviewRequestDTO),
      asyncHandler(reviewController.createAgencyReview.bind(reviewController))
    );
  }
}
