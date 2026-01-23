import { UpdatePackageItineraryDTO } from "../../../dto/request/update-package-itinerary.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface IUpdatePackageItineraryUsecase {
  execute(
    packageId: string,
    agencyId: string,
    data: UpdatePackageItineraryDTO
  ): Promise<PackageResponseDTO>;
}


