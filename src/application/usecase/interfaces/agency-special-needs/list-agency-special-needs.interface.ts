import { AgencySpecialNeedsResponseDTO } from "../../../dto/response/agency-special-needs-response.dto";

export interface IListAgencySpecialNeedsUsecase {
  execute(
    agencyId: string,
    includeDeleted?: boolean
  ): Promise<AgencySpecialNeedsResponseDTO[]>;
}
