import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAgencyCategoryController } from "../../interfaces/controllers/agency/agency-category.controller.interface";
import { ICreateCategoryUsecase } from "../../../application/usecase/interfaces/category/create-category.interface";
import { IUpdateCategoryUsecase } from "../../../application/usecase/interfaces/category/update-category.interface";
import { IDeleteCategoryUsecase } from "../../../application/usecase/interfaces/category/delete-category.interface";
import { IListCategoriesUsecase } from "../../../application/usecase/interfaces/category/list-categories.interface";
import { IListActiveCategoriesUsecase } from "../../../application/usecase/interfaces/category/list-active-categories.interface";
import { CreateCategoryRequestDTO } from "../../../application/dto/request/create-category-request.dto";
import { UpdateCategoryRequestDTO } from "../../../application/dto/request/update-category-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { NotFoundError } from "../../../domain/errors/notFoundError";

@injectable()
export class AgencyCategoryController implements IAgencyCategoryController {
  constructor(
    @inject("ICreateCategoryUsecase")
    private _createCategoryUsecase: ICreateCategoryUsecase,
    @inject("IUpdateCategoryUsecase")
    private _updateCategoryUsecase: IUpdateCategoryUsecase,
    @inject("IDeleteCategoryUsecase")
    private _deleteCategoryUsecase: IDeleteCategoryUsecase,
    @inject("IListCategoriesUsecase")
    private _listCategoriesUsecase: IListCategoriesUsecase,
    @inject("IListActiveCategoriesUsecase")
    private _listActiveCategoriesUsecase: IListActiveCategoriesUsecase,
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository
  ) {}

  private async getAgencyId(req: CustomRequest): Promise<string> {
    if (!req.user) {
      throw new NotFoundError("User not authenticated");
    }
    const agency = await this._agencyRepository.findByUserId(req.user.id);
    if (!agency) {
      throw new NotFoundError("Agency not found");
    }
    return agency._id;
  }

  async createCategory(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);

    const data = req.body as CreateCategoryRequestDTO;
    const category = await this._createCategoryUsecase.execute(agencyId, data);

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      "Category created successfully",
      category
    );
  }

  async updateCategory(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const categoryId = req.params.id;
    const data = req.body as UpdateCategoryRequestDTO;

    const category = await this._updateCategoryUsecase.execute(
      categoryId,
      agencyId,
      data
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Category updated successfully",
      category
    );
  }

  async deleteCategory(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const categoryId = req.params.id;
    await this._deleteCategoryUsecase.execute(categoryId, agencyId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Category deleted successfully"
    );
  }

  async getCategories(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const includeDeleted = req.query.includeDeleted === "true";
    const categories = await this._listCategoriesUsecase.execute(
      agencyId,
      includeDeleted
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Categories retrieved successfully",
      categories
    );
  }

  async getActiveCategories(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const categories = await this._listActiveCategoriesUsecase.execute(agencyId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Active categories retrieved successfully",
      categories
    );
  }
}
