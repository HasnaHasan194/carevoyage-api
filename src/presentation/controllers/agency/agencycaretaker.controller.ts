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
  HTTP_STATUS,
} from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
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

  async inviteCaretaker(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const userId = customReq.user.id;
    console.log(userId, "-->userId");
    // Find agency by userId
    const agency = await this._agencyRepository.findByUserId(userId);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }

    const requestData = req.body as InviteCaretakerRequestDTO;

    await this._inviteCaretakerUseCase.execute(agency._id, requestData);

    ResponseHelper.success(
      res,
      HTTP_STATUS.CREATED,
      "Caretaker invitation sent successfully"
    );
  }

  async listCaretakers(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const userId = customReq.user.id;

    const agency = await this._agencyRepository.findByUserId(userId);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }

    const profiles = await this._caretakerProfileRepository.findByAgencyId(
      agency._id
    );

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

    ResponseHelper.success(res, HTTP_STATUS.OK, "Caretakers fetched", caretakers);
  }

  async updateCaretakerAvailability(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const userId = customReq.user.id;

    const agency = await this._agencyRepository.findByUserId(userId);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }

    const caretakerId = req.params.caretakerId;
    const { status } = req.body as { status: "AVAILABLE" | "INACTIVE" };

    const profile = await this._caretakerProfileRepository.findById(caretakerId);
    if (!profile || profile.agencyId !== agency._id) {
      throw new NotFoundError("Caretaker not found for this agency");
    }

    if (profile.isDeleted) {
      throw new ValidationError("Cannot update a deleted caretaker");
    }

    if (profile.availabilityStatus === "BUSY") {
      throw new ValidationError("Cannot change availability of a busy caretaker");
    }

    if (status !== "AVAILABLE" && status !== "INACTIVE") {
      throw new ValidationError("Invalid availability status");
    }

    const updated = await this._caretakerProfileRepository.updateAvailabilityStatus(
      caretakerId,
      status
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Caretaker availability updated",
      updated
    );
  }

  async softDeleteCaretaker(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const userId = customReq.user.id;

    const agency = await this._agencyRepository.findByUserId(userId);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }

    const caretakerId = req.params.caretakerId;

    const profile = await this._caretakerProfileRepository.findById(caretakerId);
    if (!profile || profile.agencyId !== agency._id) {
      throw new NotFoundError("Caretaker not found for this agency");
    }

    const deleted = await this._caretakerProfileRepository.softDelete(caretakerId);

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Caretaker removed",
      deleted
    );
  }

  async updateCaretakerPrice(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const userId = customReq.user.id;

    const agency = await this._agencyRepository.findByUserId(userId);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }

    const caretakerId = req.params.caretakerId;
    const { pricePerDay } = req.body as { pricePerDay: number };

    if (pricePerDay < 0) {
      throw new ValidationError("Price per day must be greater than or equal to 0");
    }

    const profile = await this._caretakerProfileRepository.findById(caretakerId);
    if (!profile || profile.agencyId !== agency._id) {
      throw new NotFoundError("Caretaker not found for this agency");
    }

    const updated = await this._caretakerProfileRepository.updatePricePerDay(
      caretakerId,
      pricePerDay
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Caretaker price updated",
      updated
    );
  }

  async listCaretakerRequests(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const agency = await this._agencyRepository.findByUserId(customReq.user.id);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }
    const list = await this._listCaretakerRequestsUseCase.execute(agency._id);
    ResponseHelper.success(res, HTTP_STATUS.OK, "Caretaker requests retrieved", list);
  }

  async fulfillCaretakerRequest(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const agency = await this._agencyRepository.findByUserId(customReq.user.id);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }
    const requestId = req.params.requestId;
    const { noteToClient, caretakerId } = req.body as { noteToClient?: string; caretakerId?: string };
    await this._fulfillCaretakerRequestUseCase.execute(agency._id, requestId, {
      noteToClient,
      caretakerId,
    });
    ResponseHelper.success(res, HTTP_STATUS.OK, "Request fulfilled. Client has been notified.");
  }

  async listRefundRequests(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const agency = await this._agencyRepository.findByUserId(customReq.user.id);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }
    const list = await this._listAgencyRefundRequestsUseCase.execute(agency._id);
    ResponseHelper.success(res, HTTP_STATUS.OK, "Refund requests retrieved", list);
  }

  async approveRefundRequest(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const agency = await this._agencyRepository.findByUserId(customReq.user.id);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }
    const requestId = req.params.requestId;
    await this._approveRefundUseCase.execute(agency._id, requestId);
    ResponseHelper.success(res, HTTP_STATUS.OK, "Refund approved");
  }

  async rejectRefundRequest(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const agency = await this._agencyRepository.findByUserId(customReq.user.id);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }
    const requestId = req.params.requestId;
    const { reason } = req.body as { reason?: string };
    await this._rejectRefundUseCase.execute(agency._id, requestId, reason);
    ResponseHelper.success(res, HTTP_STATUS.OK, "Refund rejected");
  }

  async getBookingDetail(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    if (!customReq.user) {
      throw new NotFoundError("User not authenticated");
    }
    const agency = await this._agencyRepository.findByUserId(customReq.user.id);
    if (!agency) {
      throw new NotFoundError("Agency not found for this user");
    }

    const bookingId = req.params.bookingId;

    const detail = await this._getAgencyBookingDetailUseCase.execute(
      agency._id,
      bookingId
    );

    ResponseHelper.success(
      res,
      HTTP_STATUS.OK,
      "Booking detail retrieved",
      detail
    );
  }
}






