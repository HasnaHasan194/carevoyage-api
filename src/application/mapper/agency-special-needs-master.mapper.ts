import { IAgencySpecialNeedsMasterEntity } from "../../domain/entities/agency-special-needs-master.entity";
import { IAgencySpecialNeedsMasterModel } from "../../infrastructure/database/models/interfaces/agency-special-needs-master.model.interface";
import { AgencySpecialNeedsMasterResponseDTO } from "../dto/response/agency-special-needs-master-response.dto";

export class AgencySpecialNeedsMasterMapper {
  static toEntity(
    doc: IAgencySpecialNeedsMasterModel
  ): IAgencySpecialNeedsMasterEntity {
    return {
      _id: doc._id.toString(),
      agencyId: doc.agencyId.toString(),
      name: doc.name,
      description: doc.description,
      isDeleted: doc.isDeleted,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toResponseDto(
    entity: IAgencySpecialNeedsMasterEntity
  ): AgencySpecialNeedsMasterResponseDTO {
    return {
      id: entity._id,
      agencyId: entity.agencyId,
      name: entity.name,
      description: entity.description,
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
