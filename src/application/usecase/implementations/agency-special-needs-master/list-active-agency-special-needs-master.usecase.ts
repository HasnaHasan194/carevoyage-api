import { inject, injectable } from "tsyringe";
import { IListActiveAgencySpecialNeedsMasterUsecase } from "../../interfaces/agency-special-needs-master/list-active-agency-special-needs-master.interface";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { AgencySpecialNeedsMasterMapper } from "../../../mapper/agency-special-needs-master.mapper";

@injectable()
export class ListActiveAgencySpecialNeedsMasterUsecase
  implements IListActiveAgencySpecialNeedsMasterUsecase
{
  constructor(
    @inject("IAgencySpecialNeedsMasterRepository")
    private _agencySpecialNeedsMasterRepository: IAgencySpecialNeedsMasterRepository
  ) {}

  async execute(agencyId: string) {
    const entities =
      await this._agencySpecialNeedsMasterRepository.findActiveByAgencyId(
        agencyId
      );
    // Defensive: only return entities that are explicitly not deleted
    const activeEntities = entities.filter(
      (entity) => entity.isDeleted === false
    );
    return activeEntities.map((entity) =>
      AgencySpecialNeedsMasterMapper.toResponseDto(entity)
    );
  }
}
