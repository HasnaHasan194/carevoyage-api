import { Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAgencySpecialNeedsMasterController } from "../../interfaces/controllers/agency/agency-special-needs-master.controller.interface";
import { ICreateAgencySpecialNeedsMasterUsecase } from "../../../application/usecase/interfaces/agency-special-needs-master/create-agency-special-needs-master.interface";
import { IUpdateAgencySpecialNeedsMasterUsecase } from "../../../application/usecase/interfaces/agency-special-needs-master/update-agency-special-needs-master.interface";
import { IDeleteAgencySpecialNeedsMasterUsecase } from "../../../application/usecase/interfaces/agency-special-needs-master/delete-agency-special-needs-master.interface";
import { IListAgencySpecialNeedsMasterUsecase } from "../../../application/usecase/interfaces/agency-special-needs-master/list-agency-special-needs-master.interface";
import { IListActiveAgencySpecialNeedsMasterUsecase } from "../../../application/usecase/interfaces/agency-special-needs-master/list-active-agency-special-needs-master.interface";
import { CreateAgencySpecialNeedsMasterRequestDTO } from "../../../application/dto/request/create-agency-special-needs-master-request.dto";
import { UpdateAgencySpecialNeedsMasterRequestDTO } from "../../../application/dto/request/update-agency-special-needs-master-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { ERROR_MESSAGE, HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
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
    @inject("IListActiveAgencySpecialNeedsMasterUsecase")
    private _listActiveAgencySpecialNeedsMasterUsecase: IListActiveAgencySpecialNeedsMasterUsecase,
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
      SUCCESS_MESSAGE.SPECIAL_NEEDS.MASTER_CREATED,
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
      SUCCESS_MESSAGE.SPECIAL_NEEDS.MASTER_UPDATED,
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
      SUCCESS_MESSAGE.SPECIAL_NEEDS.MASTER_DELETED
    );
  }

  async getSpecialNeeds(req: CustomRequest, res: Response): Promise<void> {
    const agencyId = await this.getAgencyId(req);
    const includeDeleted = req.query.includeDeleted === "true";
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const specialNeeds = await this._listAgencySpecialNeedsMasterUsecase.execute(
      agencyId,
      includeDeleted,
      page,
      limit
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.SPECIAL_NEEDS.MASTER_LIST_FETCHED,
      specialNeeds
    );
  }

  async getActiveSpecialNeeds(
    req: CustomRequest,
    res: Response
  ): Promise<void> {
    const agencyId = await this.getAgencyId(req);

    const specialNeeds =
      await this._listActiveAgencySpecialNeedsMasterUsecase.execute(agencyId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.SPECIAL_NEEDS.MASTER_ACTIVE_LIST_FETCHED,
      specialNeeds
    );
  }
}
