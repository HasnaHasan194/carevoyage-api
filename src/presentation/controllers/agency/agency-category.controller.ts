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
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
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
      throw new NotFoundError(ERROR_MESSAGE.AUTHENTICATION.USER_NOT_AUTHENTICATED);
    }
    const agency = await this._agencyRepository.findByUserId(req.user.id);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
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
      SUCCESS_MESSAGE.CATEGORY.CREATED,
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
      SUCCESS_MESSAGE.CATEGORY.UPDATED,
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
      SUCCESS_MESSAGE.CATEGORY.DELETED
    );
  }

  async getCategories(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const includeDeleted = req.query.includeDeleted === "true";
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const categories = await this._listCategoriesUsecase.execute(
      agencyId,
      includeDeleted,
      page,
      limit
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CATEGORY.LIST_FETCHED,
      categories
    );
  }

  async getActiveCategories(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const categories = await this._listActiveCategoriesUsecase.execute(agencyId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CATEGORY.ACTIVE_LIST_FETCHED,
      categories
    );
  }
}
