import { UpdatePackageImagesDTO } from "../../../dto/request/update-package-images.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface IUpdatePackageImagesUsecase {
  execute(
    packageId: string,
    agencyId: string,
    data: UpdatePackageImagesDTO
  ): Promise<PackageResponseDTO>;
}





