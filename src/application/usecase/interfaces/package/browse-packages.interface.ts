import { BrowsePackagesRequestDTO } from "../../../dto/request/browse-packages-request.dto";
import { BrowsePackagesResponseDTO } from "../../../dto/response/browse-packages-response.dto";

export interface IBrowsePackagesUsecase {
  execute(filters: BrowsePackagesRequestDTO): Promise<BrowsePackagesResponseDTO>;
}


