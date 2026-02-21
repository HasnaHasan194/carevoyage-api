import { inject, injectable } from "tsyringe";
import { IListAgencySpecialNeedsUsecase } from "../../interfaces/agency-special-needs/list-agency-special-needs.interface";
import { AgencySpecialNeedsResponseDTO } from "../../../dto/response/agency-special-needs-response.dto";
import { IAgencySpecialNeedsRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeeds/agency-special-needs.repository.interface";
import { IAgencySpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/AgencySpecialNeedsMaster/agency-special-needs-master.repository.interface";
import { AgencySpecialNeedsMapper } from "../../../mapper/agency-special-needs.mapper";

@injectable()
export class ListAgencySpecialNeedsUsecase
  implements IListAgencySpecialNeedsUsecase
{
  constructor(
    @inject("IAgencySpecialNeedsRepository")
    private _agencySpecialNeedsRepository: IAgencySpecialNeedsRepository,
    @inject("IAgencySpecialNeedsMasterRepository")
    private _agencySpecialNeedsMasterRepository: IAgencySpecialNeedsMasterRepository
  ) {}

  async execute(
    agencyId: string,
    includeDeleted: boolean = false
  ): Promise<AgencySpecialNeedsResponseDTO[]> {
    const entities = await this._agencySpecialNeedsRepository.findByAgencyId(
      agencyId,
      includeDeleted
    );

    // Populate special need master details for each entity
    const responsePromises = entities.map(async (entity) => {
      const master = await this._agencySpecialNeedsMasterRepository.findByIdAndAgencyId(
        entity.specialNeedId,
        agencyId
      );
      
      if (!master) {
        return AgencySpecialNeedsMapper.toResponseDto(entity);
      }

      return AgencySpecialNeedsMapper.toResponseDto(entity, {
        id: master._id.toString(),
        name: master.name,
        shortCode: undefined,
        description: master.description,
      });
    });

    return Promise.all(responsePromises);
  }
}
