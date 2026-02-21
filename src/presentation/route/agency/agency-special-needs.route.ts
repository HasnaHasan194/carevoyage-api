import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { EnableSpecialNeedRequestDTO } from "../../../application/dto/request/enable-special-need-request.dto";
import { UpdateSpecialNeedRequestDTO } from "../../../application/dto/request/update-special-need-request.dto";
import { ToggleActiveStatusRequestDTO } from "../../../application/dto/request/toggle-active-status-request.dto";
import { authorizeRole } from "../../middlewares/auth.middleware";

@injectable()
export class AgencySpecialNeedsRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    let agencySpecialNeedsController: any;
    try {
      const resolveModule = require("../../../infrastructure/dependencyinjection/resolve");
      agencySpecialNeedsController = resolveModule.agencySpecialNeedsController;
    } catch (error) {
      console.error(
        "[ERROR] Failed to load agencySpecialNeedsController:",
        error
      );
      throw new Error(
        `Failed to load agencySpecialNeedsController: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    if (!agencySpecialNeedsController) {
      throw new Error("agencySpecialNeedsController is undefined");
    }

    // List Agency Special Needs
    this.router.get(
      "/special-needs",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencySpecialNeedsController.listAgencySpecialNeeds.bind(
          agencySpecialNeedsController
        )
      )
    );

    // Enable Special Need
    this.router.post(
      "/special-needs",
      authorizeRole(["agency_owner"]),
      validationMiddleware(EnableSpecialNeedRequestDTO),
      asyncHandler(
        agencySpecialNeedsController.enableSpecialNeed.bind(
          agencySpecialNeedsController
        )
      )
    );

    // Update Special Need
    this.router.put(
      "/special-needs/:id",
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdateSpecialNeedRequestDTO),
      asyncHandler(
        agencySpecialNeedsController.updateSpecialNeed.bind(
          agencySpecialNeedsController
        )
      )
    );

    // Toggle Active Status
    this.router.patch(
      "/special-needs/:id/toggle-active",
      authorizeRole(["agency_owner"]),
      validationMiddleware(ToggleActiveStatusRequestDTO),
      asyncHandler(
        agencySpecialNeedsController.toggleActiveStatus.bind(
          agencySpecialNeedsController
        )
      )
    );

    // Soft Delete Special Need
    this.router.delete(
      "/special-needs/:id",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencySpecialNeedsController.softDeleteSpecialNeed.bind(
          agencySpecialNeedsController
        )
      )
    );
  }
}
