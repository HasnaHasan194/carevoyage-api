import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAgencySpecialNeedsController } from "../../interfaces/controllers/agency/agency-special-needs.controller.interface";
import { IEnableSpecialNeedUsecase } from "../../../application/usecase/interfaces/agency-special-needs/enable-special-need.interface";
import { IUpdateSpecialNeedUsecase } from "../../../application/usecase/interfaces/agency-special-needs/update-special-need.interface";
import { IToggleActiveStatusUsecase } from "../../../application/usecase/interfaces/agency-special-needs/toggle-active-status.interface";
import { ISoftDeleteSpecialNeedUsecase } from "../../../application/usecase/interfaces/agency-special-needs/soft-delete-special-need.interface";
import { IListAgencySpecialNeedsUsecase } from "../../../application/usecase/interfaces/agency-special-needs/list-agency-special-needs.interface";
import { EnableSpecialNeedRequestDTO } from "../../../application/dto/request/enable-special-need-request.dto";
import { UpdateSpecialNeedRequestDTO } from "../../../application/dto/request/update-special-need-request.dto";
import { ToggleActiveStatusRequestDTO } from "../../../application/dto/request/toggle-active-status-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { NotFoundError } from "../../../domain/errors/notFoundError";

@injectable()
export class AgencySpecialNeedsController
  implements IAgencySpecialNeedsController
{
  constructor(
    @inject("IEnableSpecialNeedUsecase")
    private _enableSpecialNeedUsecase: IEnableSpecialNeedUsecase,
    @inject("IUpdateSpecialNeedUsecase")
    private _updateSpecialNeedUsecase: IUpdateSpecialNeedUsecase,
    @inject("IToggleActiveStatusUsecase")
    private _toggleActiveStatusUsecase: IToggleActiveStatusUsecase,
    @inject("ISoftDeleteSpecialNeedUsecase")
    private _softDeleteSpecialNeedUsecase: ISoftDeleteSpecialNeedUsecase,
    @inject("IListAgencySpecialNeedsUsecase")
    private _listAgencySpecialNeedsUsecase: IListAgencySpecialNeedsUsecase,
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

  async enableSpecialNeed(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const data = req.body as EnableSpecialNeedRequestDTO;

    const specialNeed = await this._enableSpecialNeedUsecase.execute(
      agencyId,
      data
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      "Special need enabled successfully",
      specialNeed
    );
  }

  async updateSpecialNeed(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const id = req.params.id;
    const data = req.body as UpdateSpecialNeedRequestDTO;

    const specialNeed = await this._updateSpecialNeedUsecase.execute(
      id,
      agencyId,
      data
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Special need updated successfully",
      specialNeed
    );
  }

  async toggleActiveStatus(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const id = req.params.id;
    const data = req.body as ToggleActiveStatusRequestDTO;

    const specialNeed = await this._toggleActiveStatusUsecase.execute(
      id,
      agencyId,
      data.isActive
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Special need status updated successfully",
      specialNeed
    );
  }

  async softDeleteSpecialNeed(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const id = req.params.id;

    await this._softDeleteSpecialNeedUsecase.execute(id, agencyId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Special need deleted successfully"
    );
  }

  async listAgencySpecialNeeds(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const includeDeleted = req.query.includeDeleted === "true";

    const specialNeeds = await this._listAgencySpecialNeedsUsecase.execute(
      agencyId,
      includeDeleted
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Special needs retrieved successfully",
      specialNeeds
    );
  }
}
