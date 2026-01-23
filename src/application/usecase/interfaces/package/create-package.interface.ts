import { CreatePackageRequestDTO } from "../../../dto/request/create-package-request.dto";
import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface ICreatePackageUsecase {
  execute(
    agencyId: string,
    data: CreatePackageRequestDTO
  ): Promise<PackageResponseDTO>;
}


