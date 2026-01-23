import { ClientSession } from "mongoose";
import { PackageMapper } from "../../../application/mapper/package.mapper";
import { IPackageEntity, TPackageStatus } from "../../../domain/entities/package.entity";
import { IPackageModel, packageDB } from "../../database/models/package.model";
import { IPackageRepository } from "../../../domain/repositoryInterfaces/Package/package.repository.interface";
import { BaseRepository } from "../baseRepository";

export class PackageRepository
  extends BaseRepository<IPackageModel, IPackageEntity>
  implements IPackageRepository
{
  constructor() {
    super(packageDB, PackageMapper.toEntity);
  }

  async findByAgencyId(
    agencyId: string,
    status: TPackageStatus | "all" = "all",
    includeDeleted: boolean = false,
    session?: ClientSession
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

  async findByIdAndAgencyId(
    packageId: string,
    agencyId: string,
    includeDeleted: boolean = false,
    session?: ClientSession
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
    session?: ClientSession
  ): Promise<IPackageEntity | null> {
    const mongooseQuery = packageDB.findByIdAndUpdate(
      packageId,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
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
    session?: ClientSession
  ): Promise<IPackageEntity | null> {
    const mongooseQuery = packageDB.findByIdAndUpdate(
      packageId,
      { $set: { status } },
      { new: true }
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
      page,
      limit,
    } = filters;

    const skip = (page - 1) * limit;

    // Build match conditions
    const matchConditions: Record<string, unknown> = {
      isDeleted: false,
      status: "published", // Only show published packages
    };

    // Category filter
    if (category) {
      matchConditions.category = new RegExp(category.trim(), "i");
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      matchConditions.basePrice = {};
      if (minPrice !== undefined) {
        matchConditions.basePrice.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        matchConditions.basePrice.$lte = maxPrice;
      }
    }

    // Date range filter (overlap check)
    if (startDate || endDate) {
      const dateFilter: Record<string, unknown> = {};
      if (endDate) {
        dateFilter.startDate = { $lte: endDate };
      }
      if (startDate) {
        dateFilter.endDate = { $gte: startDate };
      }
      Object.assign(matchConditions, dateFilter);
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
    const pipeline: unknown[] = [
      // Stage 1: Match published, non-deleted packages
      {
        $match: matchConditions,
      },
      // Stage 2: Calculate duration in days
      {
        $addFields: {
          duration: {
            $ceil: {
              $divide: [
                { $subtract: ["$endDate", "$startDate"] },
                86400000, // milliseconds in a day (1000 * 60 * 60 * 24)
              ],
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
          packages: [
            { $skip: skip },
            { $limit: limit },
          ],
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

    const packages = packageDocs.map((doc) => PackageMapper.toEntity(doc));

    return { packages, total };
  }
}

