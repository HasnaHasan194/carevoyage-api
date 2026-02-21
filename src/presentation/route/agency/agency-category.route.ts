import { injectable } from "tsyringe";
import { asyncHandler } from "../../../shared/async-handler";
import { BaseRoute } from "../base.route";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { CreateCategoryRequestDTO } from "../../../application/dto/request/create-category-request.dto";
import { UpdateCategoryRequestDTO } from "../../../application/dto/request/update-category-request.dto";
import { authorizeRole } from "../../middlewares/auth.middleware";

@injectable()
export class AgencyCategoryRoutes extends BaseRoute {
  constructor() {
    super();
  }

  protected initializeRoutes(): void {
   
    let agencyCategoryController: any;
    try {
      const resolveModule = require("../../../infrastructure/dependencyinjection/resolve");
      agencyCategoryController = resolveModule.agencyCategoryController;
    } catch (error) {
      console.error('[ERROR] Failed to load agencyCategoryController:', error);
      throw new Error(`Failed to load agencyCategoryController: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    if (!agencyCategoryController) {
      throw new Error("agencyCategoryController is undefined");
    }
    
   
    this.router.post(
      "/categories",
      authorizeRole(["agency_owner"]),
      validationMiddleware(CreateCategoryRequestDTO),
      asyncHandler(
        agencyCategoryController.createCategory.bind(agencyCategoryController)
      )
    );

    // Update Category
    this.router.put(
      "/categories/:id",
      authorizeRole(["agency_owner"]),
      validationMiddleware(UpdateCategoryRequestDTO),
      asyncHandler(
        agencyCategoryController.updateCategory.bind(agencyCategoryController)
      )
    );

    // Delete Category (Soft Delete)
    this.router.delete(
      "/categories/:id",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyCategoryController.deleteCategory.bind(agencyCategoryController)
      )
    );

    // Get Categories (with optional includeDeleted query param)
    this.router.get(
      "/categories",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyCategoryController.getCategories.bind(agencyCategoryController)
      )
    );

    // Get Active Categories Only
    this.router.get(
      "/categories/active",
      authorizeRole(["agency_owner"]),
      asyncHandler(
        agencyCategoryController.getActiveCategories.bind(
          agencyCategoryController
        )
      )
    );
   
  }
}
