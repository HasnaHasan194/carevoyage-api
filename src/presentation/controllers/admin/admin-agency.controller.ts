import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAdminAgencyController } from "../../interfaces/controllers/admin/admin-agency.controller.interface";
import { IGetAllAgenciesUsecase } from "../../../application/usecase/interfaces/admin/getallagencies.interface";
import { IGetAgencyDetailsUsecase } from "../../../application/usecase/interfaces/admin/get-agency-details.interface";
import { IBlockUnblockAgencyUsecase } from "../../../application/usecase/interfaces/admin/blockUnblockAgency.interface";
import { IVerifyAgencyUsecase } from "../../../application/usecase/interfaces/admin/verify-agency.interface";
import { IRejectAgencyUsecase } from "../../../application/usecase/interfaces/admin/reject-agency.interface";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import {
  AgencyStatusFilter,
  AgencyVerificationStatusFilter,
  SortOrder,
} from "../../../application/dto/request/get-agencies-request.dto";

@injectable()
export class AdminAgencyController implements IAdminAgencyController {
  constructor(
    @inject("IGetAllAgenciesUsecase")
    private _getAllAgenciesUsecase: IGetAllAgenciesUsecase,

    @inject("IGetAgencyDetailsUsecase")
    private _getAgencyDetailsUsecase: IGetAgencyDetailsUsecase,

    @inject("IBlockUnblockAgencyUsecase")
    private _blockUnblockAgencyUsecase: IBlockUnblockAgencyUsecase,

    @inject("IVerifyAgencyUsecase")
    private _verifyAgencyUsecase: IVerifyAgencyUsecase,

    @inject("IRejectAgencyUsecase")
    private _rejectAgencyUsecase: IRejectAgencyUsecase
  ) {}

  async getAgencies(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const rawStatus = req.query.status as "all" | "blocked" | "unblocked" | undefined;
    const status =
      rawStatus === "all" || !rawStatus
        ? AgencyStatusFilter.ALL
        : rawStatus === "blocked"
        ? AgencyStatusFilter.BLOCKED
        : AgencyStatusFilter.UNBLOCKED;

    const rawVerificationStatus = req.query.verificationStatus as "all" | "pending" | "verified" | "rejected" | undefined;
    const verificationStatus =
      rawVerificationStatus === "all" || !rawVerificationStatus
        ? AgencyVerificationStatusFilter.ALL
        : rawVerificationStatus === "pending"
        ? AgencyVerificationStatusFilter.PENDING
        : rawVerificationStatus === "verified"
        ? AgencyVerificationStatusFilter.VERIFIED
        : AgencyVerificationStatusFilter.REJECTED;

    const sort = (req.query.sort as string) || "createdAt";
    const rawOrder = req.query.order as "asc" | "desc" | undefined;
    const order = rawOrder === "desc" ? SortOrder.DESC : SortOrder.ASC;

    const result = await this._getAllAgenciesUsecase.execute(
      page,
      limit,
      search,
      status,
      verificationStatus,
      sort,
      order
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Agencies retrieved successfully",
      result
    );
  }

  async getAgencyDetails(req: Request, res: Response): Promise<void> {
    const { agencyId } = req.params;

    const agency = await this._getAgencyDetailsUsecase.execute(agencyId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Agency details retrieved successfully",
      agency
    );
  }

  async blockAgency(req: Request, res: Response): Promise<void> {
    const { agencyId } = req.params;

    await this._blockUnblockAgencyUsecase.execute(agencyId, true);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.AGENCY.BLOCKED
    );
  }

  async unblockAgency(req: Request, res: Response): Promise<void> {
    const { agencyId } = req.params;

    await this._blockUnblockAgencyUsecase.execute(agencyId, false);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.AGENCY.UNBLOCKED
    );
  }

  async verifyAgency(req: Request, res: Response): Promise<void> {
    const { agencyId } = req.params;

    await this._verifyAgencyUsecase.execute(agencyId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.AGENCY.VERIFIED
    );
  }

  async rejectAgency(req: Request, res: Response): Promise<void> {
    const { agencyId } = req.params;
    const { reason } = req.body as { reason: string };

    await this._rejectAgencyUsecase.execute(agencyId, reason);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.AGENCY.REJECTED
    );
  }
}





