import { IActivityEntity } from "../../domain/entities/activity.entity";
import { IActivityModel } from "../../infrastructure/database/models/activity.model";
import { ActivityResponseDTO } from "../dto/response/package-response.dto";

export class ActivityMapper {
  static toEntity(doc: IActivityModel): IActivityEntity {
    return {
      _id: String(doc._id),
      packageId: String(doc.packageId),
      name: doc.name,
      description: doc.description,
      duration: doc.duration,
      category: doc.category,
      priceIncluded: doc.priceIncluded,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toActivityResponseDto(
    activityEntity: IActivityEntity
  ): ActivityResponseDTO {
    return {
      id: activityEntity._id,
      name: activityEntity.name,
      description: activityEntity.description,
      duration: activityEntity.duration,
      category: activityEntity.category,
      priceIncluded: activityEntity.priceIncluded,
    };
  }

  static toModel(data: Partial<IActivityEntity>): Partial<IActivityModel> {
    return {
      packageId: data.packageId as any,
      name: data.name,
      description: data.description,
      duration: data.duration,
      category: data.category,
      priceIncluded: data.priceIncluded,
    };
  }
}

