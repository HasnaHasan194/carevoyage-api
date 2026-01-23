import { inject, injectable } from "tsyringe";
import { IAgencyRepository } from "../../../../domain/repositoryInterfaces/Agency/ageny.repository.interface";
import { IGetAgencyDetailsUsecase } from "../../interfaces/admin/get-agency-details.interface";
import { AgencyResponseDTO } from "../../../dto/response/agency-response.dto";
import { AgencyMapper } from "../../../mapper/agency.mapper";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";

@injectable()
export class GetAgencyDetailsUsecase implements IGetAgencyDetailsUsecase {
  constructor(
    @inject("IAgencyRepository")
    private _agencyRepository: IAgencyRepository,
    @inject("IUserRepository")
    private _userRepository: IUserRepository
  ) {}

  async execute(agencyId: string): Promise<AgencyResponseDTO> {
    const agency = await this._agencyRepository.findById(agencyId);

    if (!agency) {
      throw new NotFoundError("Agency not found");
    }

    const owner = await this._userRepository.findById(agency.userId);

    return AgencyMapper.toAgencyResponseDto(
      agency,
      owner?.email,
      owner ? `${owner.firstName} ${owner.lastName}` : undefined
    );
  }
}


