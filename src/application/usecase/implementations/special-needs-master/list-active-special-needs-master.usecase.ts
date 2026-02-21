import { inject, injectable } from "tsyringe";
import { IListActiveSpecialNeedsMasterUsecase } from "../../interfaces/special-needs-master/list-active-special-needs-master.interface";
import { SpecialNeedsMasterResponseDTO } from "../../../dto/response/special-needs-master-response.dto";
import { ISpecialNeedsMasterRepository } from "../../../../domain/repositoryInterfaces/SpecialNeedsMaster/special-needs-master.repository.interface";
import { SpecialNeedsMasterMapper } from "../../../mapper/special-needs-master.mapper";

@injectable()
export class ListActiveSpecialNeedsMasterUsecase
  implements IListActiveSpecialNeedsMasterUsecase
{
  constructor(
    @inject("ISpecialNeedsMasterRepository")
    private _specialNeedsMasterRepository: ISpecialNeedsMasterRepository
  ) {}

  async execute(): Promise<SpecialNeedsMasterResponseDTO[]> {
    const entities = await this._specialNeedsMasterRepository.findActive();
    return entities.map((entity) =>
      SpecialNeedsMasterMapper.toResponseDto(entity)
    );
  }
}
