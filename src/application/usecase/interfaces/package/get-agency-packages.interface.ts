import { PackageResponseDTO } from "../../../dto/response/package-response.dto";

export interface PaginatedAgencyPackagesResponse {
  packages: PackageResponseDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface IGetAgencyPackagesUsecase {
  execute(
    agencyId: string,
    status?: "draft" | "published" | "completed" | "cancelled" | "all",
    page?: number,
    limit?: number,
    search?: string,
    category?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<PackageResponseDTO[] | PaginatedAgencyPackagesResponse>;
}





