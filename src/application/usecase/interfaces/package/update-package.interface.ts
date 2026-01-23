import { UpdatePackageRequestDTO } from "../../../dto/request/update-package-request.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface IUpdatePackageUsecase {
  execute(
    packageId: string,
    agencyId: string,
    data: UpdatePackageRequestDTO
  ): Promise<PackageResponseDTO>;
}


