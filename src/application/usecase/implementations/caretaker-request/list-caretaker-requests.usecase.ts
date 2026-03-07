import { inject, injectable } from "tsyringe";
import { ICaretakerRequestRepository } from "../../../../domain/repositoryInterfaces/CaretakerRequest/caretaker-request.repository.interface";
import { IPackageRepository } from "../../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import {
  IListCaretakerRequestsUseCase,
  ListCaretakerRequestsParams,
  ListCaretakerRequestsPaginatedResult,
} from "../../interfaces/caretaker-request/list-caretaker-requests.interface";
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

  async execute(params: ListCaretakerRequestsParams): Promise<ListCaretakerRequestsPaginatedResult> {
    const safePage = params.page > 0 ? params.page : 1;
    const safeLimit = params.limit > 0 ? params.limit : 10;

    // Map filter from external API ("PENDING" | "FULFILLED") to entity status ("pending" | "fulfilled")
    let statusFilter: "pending" | "fulfilled" | undefined;
    if (params.status === "PENDING") {
      statusFilter = "pending";
    } else if (params.status === "FULFILLED") {
      statusFilter = "fulfilled";
    }

    const [requests, total] = await Promise.all([
      this._caretakerRequestRepository.findByAgencyIdPaginated(
        params.agencyId,
        safePage,
        safeLimit,
        statusFilter
      ),
      this._caretakerRequestRepository.countByAgencyId(params.agencyId, statusFilter),
    ]);

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

    const totalPages = total > 0 ? Math.ceil(total / safeLimit) : 0;

    return {
      requests: result,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }
}
