import { BrowsePackagesResponseDTO } from "../../../dto/response/browse-packages-response.dto";
import { BrowsePackagesRequestDTO } from "../../../dto/request/browse-packages-request.dto";

export interface IGetUpcomingClientPackagesUsecase {
  execute(
    filters: Omit<BrowsePackagesRequestDTO, "startDate" | "endDate">
  ): Promise<BrowsePackagesResponseDTO>;
}
