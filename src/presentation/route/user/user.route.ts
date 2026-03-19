import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../../shared/async-handler";
import {
  blockedUserMiddleware,
  userController,
  profileUploadController,
  wishlistController,
} from "../../../infrastructure/dependencyinjection/resolve";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { UpdateUserProfileRequestDTO } from "../../../application/dto/request/update-user-profile-request.dto";
import { AddToWishlistRequestDTO } from "../../../application/dto/request/add-to-wishlist-request.dto";
import { CreateAgencyReviewRequestDTO } from "../../../application/dto/request/create-agency-review-request.dto";
import multer from "multer";
import { ReviewController } from "../../controllers/review/review.controller";
import { ICreateAgencyReviewUseCase } from "../../../application/usecase/interfaces/review/create-agency-review.interface";
import { container } from "tsyringe";

@injectable()
export class UserRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.use(verifyAuth);
    this.router.use(
      blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware),
    );

    this.router.get(
      "/profile",
      asyncHandler(userController.getProfile.bind(userController))
    );

    this.router.put(
      "/profile",
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
      "/upload/profile-image",
      upload.single("image"),
      asyncHandler(
        profileUploadController.uploadProfileImage.bind(profileUploadController)
      )
    );

    // Documents/KYC upload 
    this.router.post(
      "/upload/documents",
      documentUpload.array("documents", 10),
      asyncHandler(
        profileUploadController.uploadDocuments.bind(profileUploadController)
      )
    );

    
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

    // Wishlist/Bucket List Routes
    this.router.post(
      "/wishlist",
      validationMiddleware(AddToWishlistRequestDTO),
      asyncHandler(wishlistController.addToWishlist.bind(wishlistController))
    );

    this.router.delete(
      "/wishlist/:packageId",
      asyncHandler(
        wishlistController.removeFromWishlist.bind(wishlistController)
      )
    );

    this.router.get(
      "/wishlist",
      asyncHandler(wishlistController.getWishlist.bind(wishlistController))
    );

    this.router.get(
      "/wishlist/:packageId/status",
      asyncHandler(
        wishlistController.checkWishlistStatus.bind(wishlistController)
      )
    );

    // Client: submit agency review for a completed booking
    const createAgencyReviewUseCase =
      container.resolve<ICreateAgencyReviewUseCase>("ICreateAgencyReviewUseCase");

    const reviewController = new ReviewController(
      // list use case is not needed for client review submission, pass a dummy that is unused
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as any,
      createAgencyReviewUseCase,
    );

    this.router.post(
      "/agency-reviews",
      validationMiddleware(CreateAgencyReviewRequestDTO),
      asyncHandler(
        reviewController.createAgencyReview.bind(reviewController),
      ),
    );
  }
}
