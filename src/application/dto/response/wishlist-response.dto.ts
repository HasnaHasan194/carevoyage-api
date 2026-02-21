import { PackageResponseDTO } from "./package-response.dto";

export interface WishlistResponseDTO {
  id: string;
  userId: string;
  packageId: string;
  package: PackageResponseDTO;
  createdAt: Date;
  updatedAt: Date;
}
