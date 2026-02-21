import { IAgencySpecialNeedsEntity } from "../../domain/entities/agency-special-needs.entity";
import { IAgencySpecialNeedsModel } from "../../infrastructure/database/models/interfaces/agency-special-needs.model.interface";
import { AgencySpecialNeedsResponseDTO } from "../dto/response/agency-special-needs-response.dto";
import { SpecialNeedsMasterResponseDTO } from "../dto/response/special-needs-master-response.dto";

export class AgencySpecialNeedsMapper {
  static toEntity(
    doc: IAgencySpecialNeedsModel
  ): IAgencySpecialNeedsEntity {
    return {
      _id: doc._id.toString(),
      agencyId: doc.agencyId.toString(),
      specialNeedId: doc.specialNeedId.toString(),
      unit: doc.unit,
      price: doc.price,
      isActive: doc.isActive,
      isDeleted: doc.isDeleted,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDto(
    entity: IAgencySpecialNeedsEntity,
    specialNeedMaster?: any
  ): AgencySpecialNeedsResponseDTO {
    const dto: AgencySpecialNeedsResponseDTO = {
      id: entity._id,
      agencyId: entity.agencyId,
      specialNeedId: entity.specialNeedId,
      unit: entity.unit,
      price: entity.price,
      isActive: entity.isActive,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    // If specialNeedMaster is populated, add it to the response
    if (specialNeedMaster) {
      dto.specialNeed = {
        id: specialNeedMaster._id?.toString() || specialNeedMaster.id,
        name: specialNeedMaster.name,
        shortCode: specialNeedMaster.shortCode || undefined,
        description: specialNeedMaster.description || undefined,
      };
    }

    return dto;
  }
}
