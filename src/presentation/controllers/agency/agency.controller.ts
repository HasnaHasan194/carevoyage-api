import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAgencyController } from "../../interfaces/controllers/agency/agency.controller.interface";
import { IInviteCaretakerUseCase } from "../../../application/usecase/interfaces/caretaker/invite-caretaker.interface";
import { InviteCaretakerRequestDTO } from "../../../application/dto/request/invite-caretaker-request.dto";
import { ResponseHelper } from "../../../infrastructure/config/helper/response.helper";
import { HTTP_STATUS, SUCCESS_MESSAGE } from "../../../shared/constants/constants";
import { CustomRequest } from "../../middlewares/auth.middleware";
import { IAgencyRepository } from "../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { NotFoundError } from "../../../domain/errors/notFoundError";

@injectable()
export class AgencyController implements IAgencyController {
  constructor(
    @inject("IInviteCaretakerUseCase")
    private _inviteCaretakerUseCase: IInviteCaretakerUseCase,
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository
  ) {}

  async inviteCaretaker(req: Request, res: Response): Promise<void> {
    const customReq = req as CustomRequest;
    const userId = customReq.user.id;
    console.log(userId,"-->userId")
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
}



