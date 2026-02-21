import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { IGetAllAgenciesUsecase } from "../../interfaces/admin/getallagencies.interface";
import { PaginatedAgenciesResponseDTO } from "../../../dto/response/agency-response.dto";
import { AgencyMapper } from "../../../mapper/agency.mapper";
import {
  AgencyStatusFilter,
  AgencyVerificationStatusFilter,
  SortOrder,
} from "../../../dto/request/get-agencies-request.dto";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";

@injectable()
export class GetAllAgenciesUsecase implements IGetAllAgenciesUsecase {
  constructor(
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status: AgencyStatusFilter = AgencyStatusFilter.ALL,
    verificationStatus: AgencyVerificationStatusFilter = AgencyVerificationStatusFilter.ALL,
    sort: string = "createdAt",
    order: SortOrder = SortOrder.ASC
  ): Promise<PaginatedAgenciesResponseDTO> {
    const statusFilter: "all" | "blocked" | "unblocked" =
      status === AgencyStatusFilter.ALL
        ? "all"
        : status === AgencyStatusFilter.BLOCKED
        ? "blocked"
        : "unblocked";

    const verificationStatusFilter: "all" | "pending" | "verified" | "rejected" =
      verificationStatus === AgencyVerificationStatusFilter.ALL
        ? "all"
        : verificationStatus === AgencyVerificationStatusFilter.PENDING
        ? "pending"
        : verificationStatus === AgencyVerificationStatusFilter.VERIFIED
        ? "verified"
        : "rejected";

    const sortOrder: "asc" | "desc" =
      order === SortOrder.ASC ? "asc" : "desc";

    const { agencies, total } = await this._agencyRepository.findAllWithSearch(
      page,
      limit,
      search,
      statusFilter,
      verificationStatusFilter,
      sort,
      sortOrder
    );

    // Fetch owner information for each agency
    const agenciesWithOwners = await Promise.all(
      agencies.map(async (agency) => {
        const owner = await this._userRepository.findById(agency.userId);
        return AgencyMapper.toAgencyResponseDto(
          agency,
          owner?.email,
          owner ? `${owner.firstName} ${owner.lastName}` : undefined,
          owner?.phone,
          owner?.profileImage
        );
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      agencies: agenciesWithOwners,
      total,
      page,
      limit,
      totalPages,
    };
  }
}





