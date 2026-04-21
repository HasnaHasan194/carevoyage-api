import { injectable } from "tsyringe";
import { BaseRoute } from "../base.route";
import { asyncHandler } from "../../../shared/async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { BrowsePackagesRequestDTO } from "../../../application/dto/request/browse-packages-request.dto";
import { packageController } from "../../../infrastructure/dependencyinjection/resolve";
import { ROUTES } from "../routes.constants";

@injectable()
export class PackageRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
    this.router.get(
      ROUTES.PACKAGE_PUBLIC.CATEGORIES,
      asyncHandler(packageController.listBrowseCategories.bind(packageController))
    );

    //  upcoming packages (startDate > today) 
    this.router.get(
      ROUTES.PACKAGE_PUBLIC.UPCOMING,
      validationMiddleware(BrowsePackagesRequestDTO),
      asyncHandler(packageController.getUpcomingPackages.bind(packageController))
    );

    this.router.get(
      ROUTES.PACKAGE_PUBLIC.ROOT,
      validationMiddleware(BrowsePackagesRequestDTO),
      asyncHandler(packageController.browsePackages.bind(packageController))
    );
  }
}





