import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { asyncHandler } from "../../../shared/async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { BrowsePackagesRequestDTO } from "../../../application/dto/request/browse-packages-request.dto";
import { packageController } from "../../../infrastructure/dependencyinjection/resolve";

@injectable()
export class PackageRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    //  upcoming packages (startDate > today) 
    this.router.get(
      "/upcoming",
      validationMiddleware(BrowsePackagesRequestDTO),
      asyncHandler(packageController.getUpcomingPackages.bind(packageController))
    );

    this.router.get(
      "/",
      validationMiddleware(BrowsePackagesRequestDTO),
      asyncHandler(packageController.browsePackages.bind(packageController))
    );
  }
}





