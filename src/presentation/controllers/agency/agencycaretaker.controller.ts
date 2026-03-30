import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAgencyController } from "../../interfaces/controllers/agency/agency.controller.interface";
import { IInviteCaretakerUseCase } from "../../../application/usecase/interfaces/caretaker/invite-caretaker.interface";
import { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import { IListCaretakerRequestsUseCase } from "../../../application/usecase/interfaces/caretaker-request/list-caretaker-requests.interface";
import { IFulfillCaretakerRequestUseCase } from "../../../application/usecase/interfaces/caretaker-request/fulfill-caretaker-request.interface";
import { IListAgencyRefundRequestsUseCase } from "../../../application/usecase/interfaces/refund/list-agency-refund-requests.interface";
import { IApproveRefundUseCase } from "../../../application/usecase/interfaces/refund/approve-refund.interface";
import { IRejectRefundUseCase } from "../../../application/usecase/interfaces/refund/reject-refund.interface";
import { InviteCaretakerRequestDTO } from "../../../application/dto/request/invite-caretaker-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import {
  ERROR_MESSAGE,
  HTTP_STATUS,
  SUCCESS_MESSAGE,
} from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IUserRepository } from "../../../domain/repositoryInterfaces/User/user.repository.interface";
import { NotFoundError } from "../../../domain/errors/notFoundError";
import { ValidationError } from "../../../domain/errors/validationError";
import { IGetAgencyBookingDetailUseCase } from "../../../application/usecase/interfaces/booking/get-agency-booking-detail.interface";

@injectable()
export class AgencyController implements IAgencyController {
  constructor(
    @inject("IInviteCaretakerUseCase")
    private _inviteCaretakerUseCase: IInviteCaretakerUseCase,
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository,
    @inject("ICaretakerProfileRepository")
    private _caretakerProfileRepository: ICaretakerProfileRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository,
    @inject("IListCaretakerRequestsUseCase")
    private _listCaretakerRequestsUseCase: IListCaretakerRequestsUseCase,
    @inject("IFulfillCaretakerRequestUseCase")
    private _fulfillCaretakerRequestUseCase: IFulfillCaretakerRequestUseCase,
    @inject("IListAgencyRefundRequestsUseCase")
    private _listAgencyRefundRequestsUseCase: IListAgencyRefundRequestsUseCase,
    @inject("IApproveRefundUseCase")
    private _approveRefundUseCase: IApproveRefundUseCase,
    @inject("IRejectRefundUseCase")
    private _rejectRefundUseCase: IRejectRefundUseCase,
    @inject("IGetAgencyBookingDetailUseCase")
    private _getAgencyBookingDetailUseCase: IGetAgencyBookingDetailUseCase
  ) {}

  private async getAuthenticatedAgency(customReq: CustomRequest) {
    if (!customReq.user) {
      throw new NotFoundError(
        ERROR_MESSAGE.AUTHENTICATION.USER_NOT_AUTHENTICATED
      );
    }
    const agency = await this._agencyRepository.findByUserId(customReq.user.id);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND_FOR_USER);
    }
    return agency;
  }

  private validateCaretakerOwnership(
    profileAgencyId: string | undefined,
    agencyId: string
  ) {
    if (!profileAgencyId || profileAgencyId !== agencyId) {
      throw new NotFoundError(
        ERROR_MESSAGE.CARETAKER.NOT_FOUND_FOR_AGENCY
      );
    }
  }

  async inviteCaretaker(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);

    const requestData = req.body as InviteCaretakerRequestDTO;

    await this._inviteCaretakerUseCase.execute(agency._id, requestData);

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGE.CARETAKER.INVITATION_SENT
    );
  }

  async listCaretakers(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const [profiles, total] = await Promise.all([
      this._caretakerProfileRepository.findByAgencyIdPaginated(
        agency._id,
        page,
        limit
      ),
      this._caretakerProfileRepository.countByAgencyId(agency._id),
    ]);

    const caretakers = await Promise.all(
      profiles
        .filter((p) => !p.isDeleted)
        .map(async (p) => {
          let name: string = p.email ?? "Caretaker";
          if (p.userId) {
            const user = await this._userRepository.findById(p.userId);
            if (user) {
              const fullName = `${user.firstName} ${user.lastName}`.trim();
              if (fullName) name = fullName;
            }
          }
          return {
            id: p._id,
            name,
            email: p.email,
            status: p.status,
            availabilityStatus: p.availabilityStatus,
            verificationStatus: p.verificationStatus,
            pricePerDay: p.pricePerDay ?? 0,
            languages: p.languages ?? [],
            experienceYears: p.experienceYears ?? 0,
            profileImage: p.profileImage,
          };
        })
    );

    const totalPages = Math.ceil(total / limit);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CARETAKER.LIST_FETCHED,
      {
      caretakers,
      total,
      page,
      limit,
      totalPages,
      }
    );
  }

  async updateCaretakerAvailability(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);

    const caretakerId = req.params.caretakerId;
    const { status } = req.body as { status: "AVAILABLE" | "INACTIVE" };

    const profile = await this._caretakerProfileRepository.findById(caretakerId);
    if (!profile) {
      throw new NotFoundError(
        ERROR_MESSAGE.CARETAKER.NOT_FOUND_FOR_AGENCY
      );
    }
    this.validateCaretakerOwnership(profile.agencyId, agency._id);

    if (profile.isDeleted) {
      throw new ValidationError(ERROR_MESSAGE.CARETAKER.CANNOT_UPDATE_DELETED);
    }

    if (profile.availabilityStatus === "BUSY") {
      throw new ValidationError(
        ERROR_MESSAGE.CARETAKER.CANNOT_CHANGE_BUSY_AVAILABILITY
      );
    }

    if (status === "AVAILABLE" && profile.verificationStatus !== "verified") {
      throw new ValidationError(
        "Only verified caretakers can be set to AVAILABLE"
      );
    }

    if (status !== "AVAILABLE" && status !== "INACTIVE") {
      throw new ValidationError(
        ERROR_MESSAGE.CARETAKER.INVALID_AVAILABILITY_STATUS
      );
    }

    const updated = await this._caretakerProfileRepository.updateAvailabilityStatus(
      caretakerId,
      status
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CARETAKER.AVAILABILITY_UPDATED,
      updated
    );
  }

  async softDeleteCaretaker(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);

    const caretakerId = req.params.caretakerId;

    const profile = await this._caretakerProfileRepository.findById(caretakerId);
    if (!profile) {
      throw new NotFoundError(
        ERROR_MESSAGE.CARETAKER.NOT_FOUND_FOR_AGENCY
      );
    }
    this.validateCaretakerOwnership(profile.agencyId, agency._id);

    const deleted = await this._caretakerProfileRepository.softDelete(caretakerId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CARETAKER.REMOVED,
      deleted
    );
  }

  async updateCaretakerPrice(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);

    const caretakerId = req.params.caretakerId;
    const { pricePerDay } = req.body as { pricePerDay: number };

    if (pricePerDay < 0) {
      throw new ValidationError(
        ERROR_MESSAGE.CARETAKER.INVALID_PRICE_PER_DAY
      );
    }

    const profile = await this._caretakerProfileRepository.findById(caretakerId);
    if (!profile) {
      throw new NotFoundError(
        ERROR_MESSAGE.CARETAKER.NOT_FOUND_FOR_AGENCY
      );
    }
    this.validateCaretakerOwnership(profile.agencyId, agency._id);

    const updated = await this._caretakerProfileRepository.updatePricePerDay(
      caretakerId,
      pricePerDay
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CARETAKER.PRICE_UPDATED,
      updated
    );
  }

  async listCaretakerRequests(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const rawStatus = (req.query.status as string | undefined) ?? undefined;

    const result = await this._listCaretakerRequestsUseCase.execute({
      agencyId: agency._id,
      page,
      limit,
      status:
        rawStatus === "PENDING" || rawStatus === "FULFILLED"
          ? rawStatus
          : undefined,
    });

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CARETAKER_REQUEST.LIST_FETCHED,
      result
    );
  }

  async fulfillCaretakerRequest(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);
    const requestId = req.params.requestId;
    const { noteToClient, caretakerId } = req.body as { noteToClient?: string; caretakerId?: string };
    await this._fulfillCaretakerRequestUseCase.execute(agency._id, requestId, {
      noteToClient,
      caretakerId,
    });
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.CARETAKER_REQUEST.FULFILLED
    );
  }

  async listRefundRequests(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const result = await this._listAgencyRefundRequestsUseCase.execute({
      agencyId: agency._id,
      page,
      limit,
    });

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.REFUND.LIST_FETCHED,
      result
    );
  }

  async approveRefundRequest(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);
    const requestId = req.params.requestId;
    await this._approveRefundUseCase.execute(agency._id, requestId);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.REFUND.APPROVED
    );
  }

  async rejectRefundRequest(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);
    const requestId = req.params.requestId;
    const { reason } = req.body as { reason?: string };
    await this._rejectRefundUseCase.execute(agency._id, requestId, reason);
    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.REFUND.REJECTED
    );
  }

  async getBookingDetail(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const agency = await this.getAuthenticatedAgency(customReq);

    const bookingId = req.params.bookingId;

    const detail = await this._getAgencyBookingDetailUseCase.execute(
      agency._id,
      bookingId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGE.BOOKING.DETAIL_FETCHED,
      detail
    );
  }
}






