import { ICategoryEntity } from "../../domain/entities/category.entity";
import { ICategoryModel } from "../../infrastructure/database/models/interfaces/category.model.interface";
import { CategoryResponseDTO } from "../dto/response/category-response.dto";

export class CategoryMapper {
  static toEntity(doc: ICategoryModel): ICategoryEntity {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      agencyId: doc.agencyId.toString(),
      isDeleted: doc.isDeleted,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDto(entity: ICategoryEntity): CategoryResponseDTO {
    return {
      id: entity._id,
      name: entity.name,
      agencyId: entity.agencyId,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
