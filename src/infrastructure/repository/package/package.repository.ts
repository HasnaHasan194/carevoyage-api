import { ClientSession, PipelineStage } from "mongoose";
import { PackageMapper } from "../../../application/mapper/package.mapper";
import {
  IPackageEntity,
  TPackageStatus,
} from "../../../domain/entities/package.entity";
import { IPackageModel, packageDB } from "../../database/models/package.model";
import { IPackageRepository } from "../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { BaseRepository } from "../baseRepository";
import { PackageCategory } from "../../../domain/constants/package-categories";

export class PackageRepository
  extends BaseRepository<IPackageModel, IPackageEntity>
  implements IPackageRepository
{
  constructor() {
    super(packageDB, PackageMapper.toEntity);
  }

  async findByIds(packageIds: string[]): Promise<IPackageEntity[]> {
    if (packageIds.length === 0) return [];
    const docs = await packageDB
      .find({ _id: { $in: packageIds } })
      .exec();
    return docs.map((pkg) => PackageMapper.toEntity(pkg));
  }

  async findByAgencyId(
    agencyId: string,
    status: TPackageStatus | "all" = "all",
    includeDeleted: boolean = false,
    session?: ClientSession,
  ): Promise<IPackageEntity[]> {
    const query: Record<string, unknown> = { agencyId };

    if (status && status !== "all") {
      query.status = status;
    }

    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const mongooseQuery = packageDB.find(query).sort({ createdAt: -1 });

    if (session) {
      mongooseQuery.session(session);
    }

    const packages = await mongooseQuery.exec();
    return packages.map((pkg) => PackageMapper.toEntity(pkg));
  }

  async findByAgencyIdPaginated(
    agencyId: string,
    page: number,
    limit: number,
    status: TPackageStatus | "all" = "all",
    includeDeleted: boolean = false,
    search?: string,
    category?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
  ): Promise<{ packages: IPackageEntity[]; total: number }> {
    const query: Record<string, unknown> = { agencyId };

    if (status && status !== "all") {
      query.status = status;
    }

    if (!includeDeleted) {
      query.isDeleted = false;
    }

    // Category filter
    if (category && category.trim()) {
      query.category = new RegExp(category.trim(), "i");
    }

    // Search filter (PackageName, category, meetingPoint)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { PackageName: searchRegex },
        { category: searchRegex },
        { meetingPoint: searchRegex },
      ];
    }

    const pageNum = Math.max(1, Math.floor(page) || 1);
    const limitNum = Math.max(1, Math.floor(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    // Determine sort field and order
    const sortField = sortBy === "price" ? "basePrice" : sortBy || "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // Get total count
    const total = await packageDB.countDocuments(query);

    // Get paginated packages
    const packages = await packageDB
      .find(query)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limitNum)
      .exec();

    return {
      packages: packages.map((pkg) => PackageMapper.toEntity(pkg)),
      total,
    };
  }

  async findByIdAndAgencyId(
    packageId: string,
    agencyId: string,
    includeDeleted: boolean = false,
    session?: ClientSession,
  ): Promise<IPackageEntity | null> {
    const query: Record<string, unknown> = { _id: packageId, agencyId };

    if (!includeDeleted) {
      query.isDeleted = false;
    }

    const mongooseQuery = packageDB.findOne(query);

    if (session) {
      mongooseQuery.session(session);
    }

    const pkg = await mongooseQuery.exec();
    return pkg ? PackageMapper.toEntity(pkg) : null;
  }

  async deletePackage(
    packageId: string,
    session?: ClientSession,
  ): Promise<IPackageEntity | null> {
    const mongooseQuery = packageDB.findByIdAndUpdate(
      packageId,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true },
    );

    if (session) {
      mongooseQuery.session(session);
    }

    const pkg = await mongooseQuery.exec();
    return pkg ? PackageMapper.toEntity(pkg) : null;
  }

  async updateStatus(
    packageId: string,
    status: TPackageStatus,
    session?: ClientSession,
  ): Promise<IPackageEntity | null> {
    const mongooseQuery = packageDB.findByIdAndUpdate(
      packageId,
      { $set: { status } },
      { new: true },
    );

    if (session) {
      mongooseQuery.session(session);
    }

    const pkg = await mongooseQuery.exec();
    return pkg ? PackageMapper.toEntity(pkg) : null;
  }

  async browsePackages(filters: {
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
    activeCategoryNames?: string[];
  }): Promise<{ packages: IPackageEntity[]; total: number }> {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      minDuration,
      maxDuration,
      sortBy = "basePrice",
      sortOrder = "asc",
      activeCategoryNames,
    } = filters;

    const page = Math.max(1, Math.floor(filters.page) || 1);
    const limit = Math.max(1, Math.floor(filters.limit) || 2);

    const skip = (page - 1) * limit;

    console.log(`[browsePackages] page=${page}, limit=${limit}, skip=${skip}`);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const matchConditions: Record<string, unknown> = {
      isDeleted: false,
      status: "published",
    };

    // Filter by active categories - packages must belong to active categories only
    if (activeCategoryNames !== undefined) {
      if (activeCategoryNames.length === 0) {
        // If no active categories exist, return empty result
        return { packages: [], total: 0 };
      }
      // Filter by active category names
      if (category) {
        const categoryRegex = new RegExp(category.trim(), "i");
        const filteredActiveCategories = activeCategoryNames.filter((cat) =>
          categoryRegex.test(cat),
        );
        if (filteredActiveCategories.length === 0) {
          return { packages: [], total: 0 };
        }
        matchConditions.category = { $in: filteredActiveCategories };
      } else {
        matchConditions.category = { $in: activeCategoryNames };
      }
    } else if (category) {
      // If activeCategoryNames not provided but category filter exists, use regex
      matchConditions.category = new RegExp(category.trim(), "i");
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) {
        priceFilter.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        priceFilter.$lte = maxPrice;
      }
      matchConditions.basePrice = priceFilter;
    }

    let normalizedStartDate: Date | undefined;
    if (startDate) {
      normalizedStartDate = new Date(startDate);
      normalizedStartDate.setUTCHours(0, 0, 0, 0);
    }

    const minEndDate =
      normalizedStartDate && normalizedStartDate > today
        ? normalizedStartDate
        : today;

    matchConditions.endDate = { $gte: minEndDate };

    if (endDate) {
      const normalizedEndDate = new Date(endDate);
      normalizedEndDate.setUTCHours(23, 59, 59, 999);
      matchConditions.startDate = { $lte: normalizedEndDate };
    }

    // Search filter (PackageName, Category, Tags)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      matchConditions.$or = [
        { PackageName: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Build aggregation pipeline
    const pipeline: PipelineStage[] = [
      {
        $match: matchConditions,
      },

      {
        $addFields: {
          duration: {
            $ceil: {
              $divide: [{ $subtract: ["$endDate", "$startDate"] }, 86400000],
            },
          },
        },
      },
      // Stage 3: Filter by duration range
      ...(minDuration !== undefined || maxDuration !== undefined
        ? [
            {
              $match: {
                duration: {
                  ...(minDuration !== undefined && { $gte: minDuration }),
                  ...(maxDuration !== undefined && { $lte: maxDuration }),
                },
              },
            },
          ]
        : []),
      // Stage 4: Sort
      {
        $sort: {
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        },
      },
      // Stage 5: Facet for pagination metadata
      {
        $facet: {
          packages: [{ $skip: Number(skip) }, { $limit: Number(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
      // Stage 6: Unwind totalCount
      {
        $unwind: {
          path: "$totalCount",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Stage 7: Project final structure
      {
        $project: {
          packages: 1,
          total: { $ifNull: ["$totalCount.count", 0] },
        },
      },
    ];

    const result = await packageDB.aggregate(pipeline).exec();

    if (!result || result.length === 0) {
      return { packages: [], total: 0 };
    }

    const { packages: packageDocs, total } = result[0];

    const packages = packageDocs.map((doc: IPackageModel) =>
      PackageMapper.toEntity(doc),
    );

    return { packages, total };
  }

  /**
   * Client-only: returns packages where startDate > today (UTC).
   * Excludes ongoing and expired packages. Does not affect admin/agency APIs.
   */
  async findUpcomingClientPackages(filters: {
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
    activeCategoryNames?: string[];
  }): Promise<{ packages: IPackageEntity[]; total: number }> {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      sortBy = "basePrice",
      sortOrder = "asc",
      activeCategoryNames,
    } = filters;

    const page = Math.max(1, Math.floor(filters.page) || 1);
    const limit = Math.max(1, Math.floor(filters.limit) || 10);
    const skip = (page - 1) * limit;

    //  packages must  startDate > today
    const todayStartUTC = new Date();
    todayStartUTC.setUTCHours(0, 0, 0, 0);

    const matchConditions: Record<string, unknown> = {
      isDeleted: false,
      status: "published",
      startDate: { $gt: todayStartUTC },
      endDate: { $gte: todayStartUTC },
    };

    // Filter by active categories - packages must belong to active categories only
    if (activeCategoryNames !== undefined) {
      if (activeCategoryNames.length === 0) {
        // If no active categories exist, return empty result
        return { packages: [], total: 0 };
      }
      // Filter by active category names
      if (category) {
        // If user provided category filter, filter active categories first, then apply regex
        const categoryRegex = new RegExp(category.trim(), "i");
        const filteredActiveCategories = activeCategoryNames.filter((cat) =>
          categoryRegex.test(cat),
        );
        if (filteredActiveCategories.length === 0) {
          return { packages: [], total: 0 };
        }
        matchConditions.category = { $in: filteredActiveCategories };
      } else {
        matchConditions.category = { $in: activeCategoryNames };
      }
    } else if (category) {
      // If activeCategoryNames not provided but category filter exists, use regex
      matchConditions.category = new RegExp(category.trim(), "i");
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter.$gte = minPrice;
      if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
      matchConditions.basePrice = priceFilter;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      matchConditions.$or = [
        { PackageName: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    const pipeline: PipelineStage[] = [
      { $match: matchConditions },
      {
        $addFields: {
          duration: {
            $ceil: {
              $divide: [{ $subtract: ["$endDate", "$startDate"] }, 86400000],
            },
          },
        },
      },
      ...(minDuration !== undefined || maxDuration !== undefined
        ? [
            {
              $match: {
                duration: {
                  ...(minDuration !== undefined && { $gte: minDuration }),
                  ...(maxDuration !== undefined && { $lte: maxDuration }),
                },
              },
            },
          ]
        : []),
      {
        $sort: {
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $facet: {
          packages: [{ $skip: Number(skip) }, { $limit: Number(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $unwind: {
          path: "$totalCount",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          packages: 1,
          total: { $ifNull: ["$totalCount.count", 0] },
        },
      },
    ];

    const result = await packageDB.aggregate(pipeline).exec();

    if (!result || result.length === 0) {
      return { packages: [], total: 0 };
    }

    const { packages: packageDocs, total } = result[0];
    const packages = packageDocs.map((doc: IPackageModel) =>
      PackageMapper.toEntity(doc),
    );

    return { packages, total };
  }

  async findConflictingPackages(
    packageIds: string[],
    newStartDate: Date,
    newEndDate: Date,
  ): Promise<IPackageEntity[]> {
    if (!packageIds.length) return [];

    return packageDB.find({
      _id: { $in: packageIds },
      startDate: { $lte: newEndDate },
      endDate: { $gte: newStartDate },
    });
  }
}
