import { ClientSession } from "mongoose";
import { IPackageEntity, TPackageStatus } from "../../entities/package.entity";
import { IBaseRepository } from "../baseRepository.interface";
import { PackageCategory } from "../../constants/package-categories";

export interface IPackageRepository extends IBaseRepository<IPackageEntity> {
  findByAgencyId(
    agencyId: string,
    status?: TPackageStatus | "all",
    includeDeleted?: boolean,
    session?: ClientSession
  ): Promise<IPackageEntity[]>;

  findByIdAndAgencyId(
    packageId: string,
    agencyId: string,
    includeDeleted?: boolean,
    session?: ClientSession
  ): Promise<IPackageEntity | null>;

  updateStatus(
    packageId: string,
    status: TPackageStatus,
    session?: ClientSession
  ): Promise<IPackageEntity | null>;

  deletePackage(
    packageId: string,
    session?: ClientSession
  ): Promise<IPackageEntity | null>;

  browsePackages(filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    startDate?: Date;
    endDate?: Date;
    minDuration?: number;
    maxDuration?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page: number;
    limit: number;
  }): Promise<{ packages: IPackageEntity[]; total: number }>;

  /**
   * Client-only: returns packages where startDate > today (UTC).
   * Used for client package listing; does not affect admin/agency APIs.
   */
  findUpcomingClientPackages(filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page: number;
    limit: number;
  }): Promise<{ packages: IPackageEntity[]; total: number }>;
  

}

