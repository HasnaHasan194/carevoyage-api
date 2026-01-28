import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface ICompletePackageUsecase {
  execute(packageId: string, agencyId: string): Promise<PackageResponseDTO>;
}





