import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface IGetAgencyPackagesUsecase {
  execute(
    agencyId: string,
    status?: "draft" | "published" | "completed" | "cancelled" | "all"
  ): Promise<PackageResponseDTO[]>;
}


