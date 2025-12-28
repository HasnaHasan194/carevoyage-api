import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import { agencyController } from "../../../infrastructure/dependencyinjection/resolve";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { InviteCaretakerRequestDTO } from "../../../application/dto/request/invite-caretaker-request.dto";
import { verifyAuth } from "../../middlewares/auth.middleware";
import { authorizeRole } from "../../middlewares/auth.middleware";

@injectable()
export class AgencyRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/caretakers/invite",
      asyncHandler(verifyAuth),
      authorizeRole(["agency_owner"]),
      validationMiddleware(InviteCaretakerRequestDTO),
      asyncHandler(agencyController.inviteCaretaker.bind(agencyController))
    );
  }
}



