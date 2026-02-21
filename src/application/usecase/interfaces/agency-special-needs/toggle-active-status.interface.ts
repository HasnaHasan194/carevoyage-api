import { AgencySpecialNeedsResponseDTO } from "../../../dto/response/agency-special-needs-response.dto";

export interface IToggleActiveStatusUsecase {
  execute(
    id: string,
    agencyId: string,
    isActive: boolean
  ): Promise<AgencySpecialNeedsResponseDTO>;
}
