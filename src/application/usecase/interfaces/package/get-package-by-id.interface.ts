import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface IGetPackageByIdUsecase {
  execute(packageId: string, agencyId: string): Promise<PackageResponseDTO>;
}





