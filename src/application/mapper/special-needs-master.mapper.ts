import { ISpecialNeedsMasterEntity } from "../../domain/entities/special-needs-master.entity";
import { ISpecialNeedsMasterModel } from "../../infrastructure/database/models/interfaces/special-needs-master.model.interface";
import { SpecialNeedsMasterResponseDTO } from "../dto/response/special-needs-master-response.dto";

export class SpecialNeedsMasterMapper {
  static toEntity(doc: ISpecialNeedsMasterModel): ISpecialNeedsMasterEntity {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      shortCode: doc.shortCode,
      category: doc.category,
      description: doc.description,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDto(
    entity: ISpecialNeedsMasterEntity
  ): SpecialNeedsMasterResponseDTO {
    return {
      id: entity._id,
      name: entity.name,
      shortCode: entity.shortCode,
      category: entity.category,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
