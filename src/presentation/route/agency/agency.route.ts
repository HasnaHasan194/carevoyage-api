import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import {
  agencyController,
  agencyPackageController,
  agencyActivityController,
  agencyUploadController,
  blockedUserMiddleware,
} from "../../../infrastructure/dependencyinjection/resolve";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { InviteCaretakerRequestDTO } from "../../../application/dto/request/invite-caretaker-request.dto";
import { CreatePackageRequestDTO } from "../../../application/dto/request/create-package-request.dto";
import { UpdatePackageRequestDTO } from "../../../application/dto/request/update-package-request.dto";
import { UpdatePackageBasicDTO } from "../../../application/dto/request/update-package-basic.dto";
import { UpdatePackageImagesDTO } from "../../../application/dto/request/update-package-images.dto";
import { UpdatePackageItineraryDTO } from "../../../application/dto/request/update-package-itinerary.dto";
import { CreateActivityRequestDTO } from "../../../application/dto/request/create-activity-request.dto";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { authorizeRole } from "../../middlewares/auth.middleware";
import multer from "multer";

@injectable()
export class AgencyRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {

     this.router.use(blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware));
    // Caretaker Management Routes
    this.router.post(
      "/caretakers/invite",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      validationMiddleware(InviteCaretakerRequestDTO),
      asyncHandler(agencyController.inviteCaretaker.bind(agencyController))
    );

    // Package Management Routes
    this.router.post(
      "/packages",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      validationMiddleware(CreatePackageRequestDTO),
      asyncHandler(
        agencyPackageController.createPackage.bind(agencyPackageController)
      )
    );

    this.router.get(
      "/packages",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.getPackages.bind(agencyPackageController)
      )
    );

    this.router.get(
      "/packages/:packageId",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.getPackageById.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdatePackageRequestDTO),
      asyncHandler(
        agencyPackageController.updatePackage.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/basic",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdatePackageBasicDTO),
      asyncHandler(
        agencyPackageController.updatePackageBasic.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/images",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdatePackageImagesDTO),
      asyncHandler(
        agencyPackageController.updatePackageImages.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/itinerary",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdatePackageItineraryDTO),
      asyncHandler(
        agencyPackageController.updatePackageItinerary.bind(
          agencyPackageController
        )
      )
    );

    this.router.patch(
      "/packages/:packageId/publish",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.publishPackage.bind(agencyPackageController)
      )
    );

    this.router.delete(
      "/packages/:packageId",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.deletePackage.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/complete",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.completePackage.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/cancel",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.cancelPackage.bind(agencyPackageController)
      )
    );

    // Activity Management Routes
    this.router.post(
      "/activities",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      validationMiddleware(CreateActivityRequestDTO),
      asyncHandler(
        agencyActivityController.createActivity.bind(agencyActivityController)
      )
    );

    this.router.get(
      "/activities",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyActivityController.getAllActivities.bind(agencyActivityController)
      )
    );

    // Image Upload Routes
    const upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, 
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new Error("Only image files are allowed"));
        }
      },
    });

    this.router.post(
      "/upload/image",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      upload.single("image"),
      asyncHandler(
        agencyUploadController.uploadImage.bind(agencyUploadController)
      )
    );

    this.router.post(
      "/upload/images",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      upload.array("images", 10),
      asyncHandler(
        agencyUploadController.uploadMultipleImages.bind(agencyUploadController)
      )
    );
  }
}







