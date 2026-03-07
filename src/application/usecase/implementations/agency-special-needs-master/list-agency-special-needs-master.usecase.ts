import { inject, injectable } from "tsyringe";
import {
  IListAgencySpecialNeedsMasterUsecase,
  type ListAgencySpecialNeedsPaginatedResult,
} from "../../interfaces/agency-special-needs-master/list-agency-special-needs-master.interface";
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
    includeDeleted: boolean = false,
    page: number = 1,
    limit: number = 10
  ): Promise<ListAgencySpecialNeedsPaginatedResult> {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 10;

    const [entities, total] = await Promise.all([
      this._agencySpecialNeedsMasterRepository.findByAgencyIdPaginated(
        agencyId,
        includeDeleted,
        safePage,
        safeLimit
      ),
      this._agencySpecialNeedsMasterRepository.countByAgencyId(
        agencyId,
        includeDeleted
      ),
    ]);

    const items = entities.map((entity) =>
      AgencySpecialNeedsMasterMapper.toResponseDto(entity)
    );
    const totalPages = total > 0 ? Math.ceil(total / safeLimit) : 0;

    return {
      specialNeeds: items,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }
}
