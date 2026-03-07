import { inject, injectable } from "tsyringe";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/agency.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { ICaretakerRequestRepository } from "../../../../domain/repositoryInterfaces/CaretakerRequest/caretaker-request.repository.interface";
import { IEmailService } from "../../../../domain/service-interfaces/email-service.interface";
import { ICreateCaretakerRequestUseCase } from "../../interfaces/caretaker-request/create-caretaker-request.interface";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";
import { config } from "../../../../shared/config";

@injectable()
export class CreateCaretakerRequestUseCase implements ICreateCaretakerRequestUseCase {
  constructor(
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository,
    @inject("ICaretakerRequestRepository")
    private _caretakerRequestRepository: ICaretakerRequestRepository,
    @inject("IEmailService")
    private _emailService: IEmailService
  ) {}

  async execute(clientId: string, packageId: string): Promise<void> {
    const pkg = await this._packageRepository.findById(packageId);
    if (!pkg) {
      throw new NotFoundError(ERROR_MESSAGE.PACKAGE.NOT_FOUND);
    }

    const agency = await this._agencyRepository.findById(pkg.agencyId);
    if (!agency) {
      throw new NotFoundError(ERROR_MESSAGE.AGENCY.NOT_FOUND);
    }

    // case: User refreshed page and resubmitted, or double-click — one pending per client+package.
    const existing = await this._caretakerRequestRepository.findPendingByClientAndPackage(
      clientId,
      packageId
    );
    if (existing) {
      return; 
    }

    await this._caretakerRequestRepository.save({
      clientId,
      packageId,
      agencyId: pkg.agencyId,
      status: "pending",
      requestedAt: new Date(),
    });

    const agencyUser = await this._userRepository.findById(agency.userId);
    if (!agencyUser?.email) return;

    const clientUser = await this._userRepository.findById(clientId);
    const clientName = clientUser
      ? `${clientUser.firstName} ${clientUser.lastName}`.trim() || clientUser.email
      : "A client";
    const clientEmail = clientUser?.email ?? "N/A";

    const dashboardUrl = config.client?.URI
      ? `${config.client.URI.replace(/\/$/, "")}/agency/caretaker-requests`
      : "#";
    const emailSubject = "CareVoyage – Caretaker request for your package";
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Caretaker request</h2>
        <p>A disabled user has requested a caretaker for one of your packages.</p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Package:</strong> ${pkg.PackageName ?? "N/A"}</li>
          <li><strong>Requested by:</strong> ${clientName}</li>
          <li><strong>Client email:</strong> ${clientEmail}</li>
        </ul>
        <p>You can invite a new caretaker or set an existing one to Available, then notify the client from your dashboard.</p>
        <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">View caretaker requests</a>
      </div>
    `;
    await this._emailService.sendMail(agencyUser.email, emailSubject, emailHtml);
  }
}
