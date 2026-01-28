import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface IPublishPackageUsecase {
  execute(packageId: string, agencyId: string): Promise<PackageResponseDTO>;
}





