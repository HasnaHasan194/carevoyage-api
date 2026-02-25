import { CaretakerRequestListItemDTO } from "../../../dto/response/caretaker-request-response.dto";

export interface IListCaretakerRequestsUseCase {
  execute(agencyId: string): Promise<CaretakerRequestListItemDTO[]>;
}
