import type { PaginatedCaretakerTripsResponseDTO } from "../../../dto/response/caretaker-trips-response.dto";

export interface ListCaretakerTripsParams {
  userId: string;
  page: number;
  limit: number;
}

export interface IListCaretakerTripsUseCase {
  execute(
    params: ListCaretakerTripsParams
  ): Promise<PaginatedCaretakerTripsResponseDTO>;
}
