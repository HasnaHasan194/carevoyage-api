import { IPackageEntity } from "../../domain/entities/package.entity";
import { IPackageModel } from "../../infrastructure/database/models/package.model";
import { PackageResponseDTO } from "../dto/response/package-response.dto";
import { IItineraryEntity } from "../../domain/entities/itinerary.entity";
import { ItineraryMapper } from "./itinerary.mapper";
import { IActivityEntity } from "../../domain/entities/activity.entity";

export class PackageMapper {
  static toEntity(doc: IPackageModel): IPackageEntity {
    return {
      _id: String(doc._id),
      agencyId: String(doc.agencyId),
      PackageName: doc.PackageName,
      description: doc.description,
      category: doc.category,
      tags: doc.tags,
      status: doc.status,
      meetingPoint: doc.meetingPoint,
      images: doc.images,
      maxGroupSize: doc.maxGroupSize,
      basePrice: doc.basePrice,
      startDate: doc.startDate,
      endDate: doc.endDate,
      itineraryId: doc.itineraryId ? String(doc.itineraryId) : undefined,
      inclusions: doc.inclusions,
      exclusions: doc.exclusions,
      isDeleted: doc.isDeleted,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toPackageResponseDto(
    packageEntity: IPackageEntity,
    itinerary?: IItineraryEntity | null,
    activitiesMap?: Map<string, IActivityEntity>
  ): PackageResponseDTO {
    return {
      id: packageEntity._id,
      agencyId: packageEntity.agencyId,
      PackageName: packageEntity.PackageName,
      description: packageEntity.description,
      category: packageEntity.category,
      tags: packageEntity.tags,
      status: packageEntity.status,
      meetingPoint: packageEntity.meetingPoint,
      images: packageEntity.images,
      maxGroupSize: packageEntity.maxGroupSize,
      basePrice: packageEntity.basePrice,
      startDate: packageEntity.startDate,
      endDate: packageEntity.endDate,
      itineraryId: packageEntity.itineraryId,
      itinerary: itinerary
        ? ItineraryMapper.toItineraryResponseDto(itinerary, activitiesMap)
        : undefined,
      inclusions: packageEntity.inclusions,
      exclusions: packageEntity.exclusions,
      createdAt: packageEntity.createdAt,
      updatedAt: packageEntity.updatedAt,
    };
  }
}

