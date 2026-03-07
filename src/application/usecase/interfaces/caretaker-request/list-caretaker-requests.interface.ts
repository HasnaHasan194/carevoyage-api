import { CaretakerRequestListItemDTO } from "../../../dto/response/caretaker-request-response.dto";

export type CaretakerRequestStatusFilter = "PENDING" | "FULFILLED";

export interface ListCaretakerRequestsParams {
  agencyId: string;
  page: number;
  limit: number;
  status?: CaretakerRequestStatusFilter;
}

export interface ListCaretakerRequestsPaginatedResult {
  requests: CaretakerRequestListItemDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListCaretakerRequestsUseCase {
  execute(params: ListCaretakerRequestsParams): Promise<ListCaretakerRequestsPaginatedResult>;
}
