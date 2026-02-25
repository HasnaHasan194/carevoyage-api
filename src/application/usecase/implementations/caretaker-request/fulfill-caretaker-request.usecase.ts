import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ICaretakerRequestRepository } from "../../../../domain/repositoryInterfaces/CaretakerRequest/caretaker-request.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IEmailService } from "../../../../domain/service-interfaces/email-service.interface";
import { IFulfillCaretakerRequestUseCase } from "../../interfaces/caretaker-request/fulfill-caretaker-request.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class FulfillCaretakerRequestUseCase implements IFulfillCaretakerRequestUseCase {
  constructor(
    @inject("ICaretakerRequestRepository")
    private _caretakerRequestRepository: ICaretakerRequestRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository,
    @inject("IEmailService")
    private _emailService: IEmailService
  ) {}

  async execute(
    agencyId: string,
    requestId: string,
    data: { noteToClient?: string; caretakerId?: string }
  ): Promise<void> {
    const request = await this._caretakerRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundError(ERROR_MESSAGE.CARETAKER_REQUEST.NOT_FOUND);
    }
    // Edge case: Request scoped to agency — only owning agency can fulfill.
    if (request.agencyId !== agencyId) {
      throw new ValidationError(ERROR_MESSAGE.CARETAKER_REQUEST.NOT_AGENCY_REQUEST);
    }
    // Edge case: Already fulfilled (e.g. duplicate click or race) — reject.
    if (request.status !== "pending") {
      throw new ValidationError(ERROR_MESSAGE.CARETAKER_REQUEST.NOT_PENDING);
    }

    // fulfilledByCaretakerId is optional; if agency later deletes that caretaker, request stays fulfilled and client was already notified.
    await this._caretakerRequestRepository.updateById(requestId, {
      status: "fulfilled",
      fulfilledAt: new Date(),
      fulfilledByCaretakerId: data.caretakerId,
      agencyNoteToClient: data.noteToClient,
    });

    const clientUser = await this._userRepository.findById(request.clientId);
    if (!clientUser?.email) return;

    const note = data.noteToClient?.trim()
      ? `<p><strong>Message from the agency:</strong></p><p>${data.noteToClient}</p>`
      : "";
    const emailSubject = "CareVoyage – A caretaker has been assigned";
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Caretaker assigned</h2>
        <p>The agency has assigned a caretaker for your request. You can now go back to the package and complete your booking with a caretaker.</p>
        ${note}
        <p>Thank you for using CareVoyage.</p>
      </div>
    `;
    await this._emailService.sendMail(clientUser.email, emailSubject, emailHtml);
  }
}
