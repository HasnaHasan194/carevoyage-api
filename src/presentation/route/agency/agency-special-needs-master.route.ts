import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { CreateAgencySpecialNeedsMasterRequestDTO } from "../../../application/dto/request/create-agency-special-needs-master-request.dto";
import { UpdateAgencySpecialNeedsMasterRequestDTO } from "../../../application/dto/request/update-agency-special-needs-master-request.dto";
import { authorizeRole } from "../../middlewares/auth.middleware";
import { ROUTES } from "../routes.constants";

@injectable()
export class AgencySpecialNeedsMasterRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    let agencySpecialNeedsMasterController: any;
    try {
      const resolveModule = require("../../../infrastructure/dependencyinjection/resolve");
      agencySpecialNeedsMasterController =
        resolveModule.agencySpecialNeedsMasterController;
    } catch (error) {
      console.error(
        "[ERROR] Failed to load agencySpecialNeedsMasterController:",
        error
      );
      throw new Error(
        `Failed to load agencySpecialNeedsMasterController: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    if (!agencySpecialNeedsMasterController) {
      throw new Error("agencySpecialNeedsMasterController is undefined");
    }
    // Create Special Need
    this.router.post(
      ROUTES.AGENCY_SPECIAL_NEEDS_MASTER.BASE,
      authorizeRole(["agency_owner"]),
      validationMiddleware(CreateAgencySpecialNeedsMasterRequestDTO),
      asyncHandler(
        agencySpecialNeedsMasterController.createSpecialNeed.bind(
          agencySpecialNeedsMasterController
        )
      )
    );

    // Update Special Need
    this.router.put(
      ROUTES.AGENCY_SPECIAL_NEEDS_MASTER.DETAIL,
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdateAgencySpecialNeedsMasterRequestDTO),
      asyncHandler(
        agencySpecialNeedsMasterController.updateSpecialNeed.bind(
          agencySpecialNeedsMasterController
        )
      )
    );

    // Delete Special Need (Soft Delete)
    this.router.delete(
      ROUTES.AGENCY_SPECIAL_NEEDS_MASTER.DETAIL,
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencySpecialNeedsMasterController.deleteSpecialNeed.bind(
          agencySpecialNeedsMasterController
        )
      )
    );

    // Get Active Special Needs Only (must be before base path so /active is not ambiguous)
    this.router.get(
      ROUTES.AGENCY_SPECIAL_NEEDS_MASTER.ACTIVE,
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencySpecialNeedsMasterController.getActiveSpecialNeeds.bind(
          agencySpecialNeedsMasterController
        )
      )
    );

    // Get Special Needs (with optional includeDeleted query param)
    this.router.get(
      ROUTES.AGENCY_SPECIAL_NEEDS_MASTER.BASE,
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencySpecialNeedsMasterController.getSpecialNeeds.bind(
          agencySpecialNeedsMasterController
        )
      )
    );
  }
}
