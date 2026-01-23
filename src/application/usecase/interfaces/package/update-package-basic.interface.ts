import { UpdatePackageBasicDTO } from "../../../dto/request/update-package-basic.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface IUpdatePackageBasicUsecase {
  execute(
    packageId: string,
    agencyId: string,
    data: UpdatePackageBasicDTO
  ): Promise<PackageResponseDTO>;
}


