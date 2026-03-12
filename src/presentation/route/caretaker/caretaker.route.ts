import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { asyncHandler } from "../../../shared/async-handler";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { authorizeRole } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { CaretakerVerificationRequestDTO } from "../../../application/dto/request/caretaker-verification-request.dto";
import { GetCaretakerTripsRequestDTO } from "../../../application/dto/request/get-caretaker-trips-request.dto";
import { caretakerVerificationController, profileUploadController, caretakerDashboardController } from "../../../infrastructure/dependencyinjection/resolve";
import multer from "multer";
import { ROUTES } from "../routes.constants";

@injectable()
export class CaretakerRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    
    const documentUpload = multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, 
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          "application/pdf",
          "image/jpeg",
          "image/jpg",
          "image/png",
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only PDF, JPG, and PNG files are allowed"));
        }
      },
    });

    
    this.router.post(
      ROUTES.CARETAKER.UPLOAD_DOCUMENTS,
      asyncHandler(verifyAuth),
      authorizeRole(["caretaker"]),
      documentUpload.array("documents", 10),
      asyncHandler(
        profileUploadController.uploadDocuments.bind(profileUploadController)
      )
    );

    this.router.post(
      ROUTES.CARETAKER.VERIFICATION,
      asyncHandler(verifyAuth),
      authorizeRole(["caretaker"]),
      validationMiddleware(CaretakerVerificationRequestDTO),
      asyncHandler(
        caretakerVerificationController.submitVerification.bind(
          caretakerVerificationController
        )
      )
    );

    this.router.get(
      ROUTES.CARETAKER.VERIFICATION_STATUS,
      asyncHandler(verifyAuth),
      authorizeRole(["caretaker"]),
      asyncHandler(
        caretakerVerificationController.getVerificationStatus.bind(
          caretakerVerificationController
        )
      )
    );

    this.router.get(
      ROUTES.CARETAKER.PROFILE,
      asyncHandler(verifyAuth),
      authorizeRole(["caretaker"]),
      asyncHandler(
        caretakerVerificationController.getProfile.bind(
          caretakerVerificationController
        )
      )
    );

    this.router.get(
      ROUTES.CARETAKER.DASHBOARD,
      asyncHandler(verifyAuth),
      authorizeRole(["caretaker"]),
      asyncHandler(
        caretakerDashboardController.getDashboard.bind(
          caretakerDashboardController
        )
      )
    );

    this.router.get(
      ROUTES.CARETAKER.TRIPS,
      asyncHandler(verifyAuth),
      authorizeRole(["caretaker"]),
      validationMiddleware(GetCaretakerTripsRequestDTO),
      asyncHandler(
        caretakerDashboardController.getTrips.bind(
          caretakerDashboardController
        )
      )
    );
  }
}

