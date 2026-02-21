import { SpecialNeedsMasterResponseDTO } from "../../../dto/response/special-needs-master-response.dto";

export interface IListActiveSpecialNeedsMasterUsecase {
  execute(): Promise<SpecialNeedsMasterResponseDTO[]>;
}
