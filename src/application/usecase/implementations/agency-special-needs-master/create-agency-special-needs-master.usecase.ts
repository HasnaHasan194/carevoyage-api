import { inject, injectable } from "tsyringe";
import { ICreateAgencySpecialNeedsMasterUsecase } from "../../interfaces/agency-special-needs-master/create-agency-special-needs-master.interface";
import { CreateAgencySpecialNeedsMasterRequestDTO } from "../../../dto/request/create-agency-special-needs-master-request.dto";
import { AgencySpecialNeedsMasterResponseDTO } from "../../../dto/response/agency-special-needs-master-response.dto";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { AgencySpecialNeedsMasterMapper } from "../../../mapper/agency-special-needs-master.mapper";
import { ValidationError } from "../../../../domain/errors/validationError";

@injectable()
export class CreateAgencySpecialNeedsMasterUsecase
  implements ICreateAgencySpecialNeedsMasterUsecase
{
  constructor(
    @inject("IAgencySpecialNeedsMasterRepository")
    private _agencySpecialNeedsMasterRepository: IAgencySpecialNeedsMasterRepository
  ) {}

  async execute(
    agencyId: string,
    data: CreateAgencySpecialNeedsMasterRequestDTO
  ): Promise<AgencySpecialNeedsMasterResponseDTO> {
    // Check if special need with same name already exists for this agency
    const existing = await this._agencySpecialNeedsMasterRepository.findByNameAndAgencyId(
      data.name,
      agencyId
    );

    if (existing) {
      throw new ValidationError(
        `Special need with name "${data.name}" already exists for this agency`
      );
    }

    // Create special need master
    const specialNeedMaster = await this._agencySpecialNeedsMasterRepository.save({
      name: data.name.trim(),
      description: data.description?.trim(),
      agencyId,
      isDeleted: false,
    });

    return AgencySpecialNeedsMasterMapper.toResponseDto(specialNeedMaster);
  }
}
