import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import {
  agencyController,
  agencyPackageController,
  agencyActivityController,
  agencyUploadController,
  agencyProfileController,
  blockedUserMiddleware,
} from "../../../infrastructure/dependencyinjection/resolve";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { InviteCaretakerRequestDTO } from "../../../application/dto/request/invite-caretaker-request.dto";
import { UpdateCaretakerAvailabilityRequestDTO } from "../../../application/dto/request/update-caretaker-availability-request.dto";
import { UpdateCaretakerPriceRequestDTO } from "../../../application/dto/request/update-caretaker-price-request.dto";
import { CreatePackageRequestDTO } from "../../../application/dto/request/create-package-request.dto";
import { UpdatePackageRequestDTO } from "../../../application/dto/request/update-package-request.dto";
import { UpdatePackageBasicDTO } from "../../../application/dto/request/update-package-basic.dto";
import { UpdatePackageImagesDTO } from "../../../application/dto/request/update-package-images.dto";
import { UpdatePackageItineraryDTO } from "../../../application/dto/request/update-package-itinerary.dto";
import { CreateActivityRequestDTO } from "../../../application/dto/request/create-activity-request.dto";
import { UpdateAgencyProfileRequestDTO } from "../../../application/dto/request/update-agency-profile-request.dto";
import { FulfillCaretakerRequestRequestDTO } from "../../../application/dto/request/fulfill-caretaker-request-request.dto";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { authorizeRole } from "../../middlewares/auth.middleware";
import multer from "multer";

@injectable()
export class AgencyRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {

    this.router.use(verifyAuth);
    this.router.use(blockedUserMiddleware.checkBlockedUser.bind(blockedUserMiddleware));

    // Agency Profile Routes
    this.router.get(
      "/profile",
      authorizeRole(["agency_owner"]),
      asyncHandler(agencyProfileController.getProfile.bind(agencyProfileController))
    );

    this.router.put(
      "/profile",
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdateAgencyProfileRequestDTO),
      asyncHandler(agencyProfileController.updateProfile.bind(agencyProfileController))
    );

    // Caretaker Management Routes
    this.router.post(
      "/caretakers/invite",
      authorizeRole(["agency_owner"]),
      validationMiddleware(InviteCaretakerRequestDTO),
      asyncHandler(agencyController.inviteCaretaker.bind(agencyController))
    );
    this.router.get(
      "/caretakers",
      authorizeRole(["agency_owner"]),
      asyncHandler(agencyController.listCaretakers.bind(agencyController))
    );
    this.router.patch(
      "/caretakers/:caretakerId/status",
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdateCaretakerAvailabilityRequestDTO),
      asyncHandler(
        agencyController.updateCaretakerAvailability.bind(agencyController)
      )
    );
    this.router.patch(
      "/caretakers/:caretakerId/price",
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdateCaretakerPriceRequestDTO),
      asyncHandler(
        agencyController.updateCaretakerPrice.bind(agencyController)
      )
    );
    this.router.delete(
      "/caretakers/:caretakerId",
      authorizeRole(["agency_owner"]),
      asyncHandler(agencyController.softDeleteCaretaker.bind(agencyController))
    );
    this.router.get(
      "/caretaker-requests",
      authorizeRole(["agency_owner"]),
      asyncHandler(agencyController.listCaretakerRequests.bind(agencyController))
    );
    this.router.patch(
      "/caretaker-requests/:requestId/fulfill",
      authorizeRole(["agency_owner"]),
      validationMiddleware(FulfillCaretakerRequestRequestDTO),
      asyncHandler(agencyController.fulfillCaretakerRequest.bind(agencyController))
    );

    this.router.get(
      "/refund-requests",
      authorizeRole(["agency_owner"]),
      asyncHandler(agencyController.listRefundRequests.bind(agencyController))
    );
    this.router.post(
      "/refund-requests/:requestId/approve",
      authorizeRole(["agency_owner"]),
      asyncHandler(agencyController.approveRefundRequest.bind(agencyController))
    );
    this.router.post(
      "/refund-requests/:requestId/reject",
      authorizeRole(["agency_owner"]),
      asyncHandler(agencyController.rejectRefundRequest.bind(agencyController))
    );

    this.router.get(
      "/bookings/:bookingId",
      authorizeRole(["agency_owner"]),
      asyncHandler(agencyController.getBookingDetail.bind(agencyController))
    );

    // Package Management Routes
    this.router.post(
      "/packages",
      authorizeRole(["agency_owner"]),
      validationMiddleware(CreatePackageRequestDTO),
      asyncHandler(
        agencyPackageController.createPackage.bind(agencyPackageController)
      )
    );

    this.router.get(
      "/packages",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.getPackages.bind(agencyPackageController)
      )
    );

    this.router.get(
      "/packages/:packageId",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.getPackageById.bind(agencyPackageController)
      )
    );

    this.router.get(
      "/packages/:packageId/bookings",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.getPackageBookings.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId",
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdatePackageRequestDTO),
      asyncHandler(
        agencyPackageController.updatePackage.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/basic",
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdatePackageBasicDTO),
      asyncHandler(
        agencyPackageController.updatePackageBasic.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/images",
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdatePackageImagesDTO),
      asyncHandler(
        agencyPackageController.updatePackageImages.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/itinerary",
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
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.publishPackage.bind(agencyPackageController)
      )
    );

    this.router.delete(
      "/packages/:packageId",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.deletePackage.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/complete",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.completePackage.bind(agencyPackageController)
      )
    );

    this.router.patch(
      "/packages/:packageId/cancel",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyPackageController.cancelPackage.bind(agencyPackageController)
      )
    );

    // Activity Management Routes
    this.router.post(
      "/activities",
      authorizeRole(["agency_owner"]),
      validationMiddleware(CreateActivityRequestDTO),
      asyncHandler(
        agencyActivityController.createActivity.bind(agencyActivityController)
      )
    );

    this.router.get(
      "/activities",
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
      "/upload/profile-image",
      authorizeRole(["agency_owner"]),
      upload.single("image"),
      asyncHandler(
        agencyUploadController.uploadProfileImage.bind(agencyUploadController)
      )
    );

    this.router.post(
      "/upload/image",
      authorizeRole(["agency_owner"]),
      upload.single("image"),
      asyncHandler(
        agencyUploadController.uploadImage.bind(agencyUploadController)
      )
    );

    this.router.post(
      "/upload/images",
      authorizeRole(["agency_owner"]),
      upload.array("images", 10),
      asyncHandler(
        agencyUploadController.uploadMultipleImages.bind(agencyUploadController)
      )
    );

    // Category Management Routes, Special Needs Master Routes, and Special Needs Routes
    // Load these routes lazily to avoid circular dependency during module loading
    let resolveModule: any;
    try {
      resolveModule = require("../../../infrastructure/dependencyinjection/resolve");
    } catch (error) {
      console.error("[ERROR] Failed to load resolve module:", error);
      throw new Error(
        `Failed to load resolve module: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    // Category Management Routes
    const agencyCategoryRoutes = resolveModule.agencyCategoryRoutes;
    if (!agencyCategoryRoutes) {
      throw new Error("agencyCategoryRoutes is undefined");
    }
    this.router.use("/", agencyCategoryRoutes.router);

    // Special Needs Master Routes
    const agencySpecialNeedsMasterRoutes = resolveModule.agencySpecialNeedsMasterRoutes;
    if (!agencySpecialNeedsMasterRoutes) {
      throw new Error("agencySpecialNeedsMasterRoutes is undefined");
    }
    this.router.use("/", agencySpecialNeedsMasterRoutes.router);

    // Special Needs Management Routes
    const agencySpecialNeedsRoutes = resolveModule.agencySpecialNeedsRoutes;
    if (!agencySpecialNeedsRoutes) {
      throw new Error("agencySpecialNeedsRoutes is undefined");
    }
    this.router.use("/", agencySpecialNeedsRoutes.router);
  }
}







