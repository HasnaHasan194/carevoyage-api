import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAgencySpecialNeedsMasterController } from "../../interfaces/controllers/agency/agency-special-needs-master.controller.interface";
import { ICreateAgencySpecialNeedsMasterUsecase } from "../../../application/usecase/interfaces/agency-special-needs-master/create-agency-special-needs-master.interface";
import { IUpdateAgencySpecialNeedsMasterUsecase } from "../../../application/usecase/interfaces/agency-special-needs-master/update-agency-special-needs-master.interface";
import { IDeleteAgencySpecialNeedsMasterUsecase } from "../../../application/usecase/interfaces/agency-special-needs-master/delete-agency-special-needs-master.interface";
import { IListAgencySpecialNeedsMasterUsecase } from "../../../application/usecase/interfaces/agency-special-needs-master/list-agency-special-needs-master.interface";
import { CreateAgencySpecialNeedsMasterRequestDTO } from "../../../application/dto/request/create-agency-special-needs-master-request.dto";
import { UpdateAgencySpecialNeedsMasterRequestDTO } from "../../../application/dto/request/update-agency-special-needs-master-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { NotFoundError } from "../../../domain/errors/notFoundError";

@injectable()
export class AgencySpecialNeedsMasterController
  implements IAgencySpecialNeedsMasterController
{
  constructor(
    @inject("ICreateAgencySpecialNeedsMasterUsecase")
    private _createAgencySpecialNeedsMasterUsecase: ICreateAgencySpecialNeedsMasterUsecase,
    @inject("IUpdateAgencySpecialNeedsMasterUsecase")
    private _updateAgencySpecialNeedsMasterUsecase: IUpdateAgencySpecialNeedsMasterUsecase,
    @inject("IDeleteAgencySpecialNeedsMasterUsecase")
    private _deleteAgencySpecialNeedsMasterUsecase: IDeleteAgencySpecialNeedsMasterUsecase,
    @inject("IListAgencySpecialNeedsMasterUsecase")
    private _listAgencySpecialNeedsMasterUsecase: IListAgencySpecialNeedsMasterUsecase,
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

  async createSpecialNeed(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const data = req.body as CreateAgencySpecialNeedsMasterRequestDTO;

    const specialNeed = await this._createAgencySpecialNeedsMasterUsecase.execute(
      agencyId,
      data
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      "Special need created successfully",
      specialNeed
    );
  }

  async updateSpecialNeed(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const id = req.params.id;
    const data = req.body as UpdateAgencySpecialNeedsMasterRequestDTO;

    const specialNeed = await this._updateAgencySpecialNeedsMasterUsecase.execute(
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

  async deleteSpecialNeed(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const id = req.params.id;

    await this._deleteAgencySpecialNeedsMasterUsecase.execute(id, agencyId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Special need deleted successfully"
    );
  }

  async getSpecialNeeds(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const includeDeleted = req.query.includeDeleted === "true";

    const specialNeeds = await this._listAgencySpecialNeedsMasterUsecase.execute(
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

  async getActiveSpecialNeeds(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    const agencyId = await this.getAgencyId(req);

    const specialNeeds = await this._listAgencySpecialNeedsMasterUsecase.execute(
      agencyId,
      false
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Active special needs retrieved successfully",
      specialNeeds
    );
  }
}
