import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface ICancelPackageUsecase {
  execute(packageId: string, agencyId: string): Promise<PackageResponseDTO>;
}





