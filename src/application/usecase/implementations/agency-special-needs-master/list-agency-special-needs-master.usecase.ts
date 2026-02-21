import { inject, injectable } from "tsyringe";
import { IListAgencySpecialNeedsMasterUsecase } from "../../interfaces/agency-special-needs-master/list-agency-special-needs-master.interface";
import { AgencySpecialNeedsMasterResponseDTO } from "../../../dto/response/agency-special-needs-master-response.dto";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { AgencySpecialNeedsMasterMapper } from "../../../mapper/agency-special-needs-master.mapper";

@injectable()
export class ListAgencySpecialNeedsMasterUsecase
  implements IListAgencySpecialNeedsMasterUsecase
{
  constructor(
    @inject("IAgencySpecialNeedsMasterRepository")
    private _agencySpecialNeedsMasterRepository: IAgencySpecialNeedsMasterRepository
  ) {}

  async execute(
    agencyId: string,
    includeDeleted: boolean = false
  ): Promise<AgencySpecialNeedsMasterResponseDTO[]> {
    const entities = await this._agencySpecialNeedsMasterRepository.findByAgencyId(
      agencyId,
      includeDeleted
    );

    return entities.map((entity) =>
      AgencySpecialNeedsMasterMapper.toResponseDto(entity)
    );
  }
}
