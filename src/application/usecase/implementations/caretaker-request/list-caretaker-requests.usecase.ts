import { inject, injectable } from "tsyringe";
import { ICaretakerRequestRepository } from "../../../../domain/repositoryInterfaces/CaretakerRequest/caretaker-request.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IListCaretakerRequestsUseCase } from "../../interfaces/caretaker-request/list-caretaker-requests.interface";
import type { CaretakerRequestListItemDTO } from "../../../dto/response/caretaker-request-response.dto";

@injectable()
export class ListCaretakerRequestsUseCase implements IListCaretakerRequestsUseCase {
  constructor(
    @inject("ICaretakerRequestRepository")
    private _caretakerRequestRepository: ICaretakerRequestRepository,
    @inject("IPackageRepository")
    private _packageRepository: IPackageRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(agencyId: string): Promise<CaretakerRequestListItemDTO[]> {
    const requests = await this._caretakerRequestRepository.findByAgencyId(agencyId);
    const result: CaretakerRequestListItemDTO[] = [];

    for (const r of requests) {
      const [pkg, clientUser] = await Promise.all([
        this._packageRepository.findById(r.packageId),
        this._userRepository.findById(r.clientId),
      ]);
      const clientName = clientUser
        ? `${clientUser.firstName} ${clientUser.lastName}`.trim() || clientUser.email
        : "Unknown";
      const clientEmail = clientUser?.email ?? "";
      // Edge case: Package or user deleted — still show request for auditing; "Unknown package" if package gone.
      result.push({
        id: r._id,
        clientId: r.clientId,
        clientName,
        clientEmail,
        packageId: r.packageId,
        packageName: pkg?.PackageName ?? "Unknown package",
        agencyId: r.agencyId,
        status: r.status,
        requestedAt: r.requestedAt,
        fulfilledAt: r.fulfilledAt,
        agencyNoteToClient: r.agencyNoteToClient,
      });
    }

    return result;
  }
}
