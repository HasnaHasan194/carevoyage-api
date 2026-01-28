import { PackageResponseDTO } from "./package-response.dto";

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface BrowsePackagesResponseDTO {
  data: PackageResponseDTO[];
  pagination: PaginationMeta;
}





