import { IAgencyEntity } from "../../domain/entities/Agency.entity";
import { IAgencyModel } from "../../infrastructure/database/models/agency.model";
import { IUserEntity } from "../../domain/entities/user.entity";
import { LoginResponseDTO } from "../dto/response/login-response.dto";

export class AgencyMapper {

  static toEntity(doc: IAgencyModel): IAgencyEntity {
    return {
      _id: String(doc._id),
      userId: String(doc.userId),
      agencyName: doc.agencyName,
      address: doc.address,
      registrationNumber: doc.registrationNumber,
      kycDocs: doc.kycDocs,
      verificationStatus: doc.verificationStatus,
      description: doc.description ?? undefined,
      isBlocked: doc.isBlocked,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }


  static mapToLoginResponseDto(
    user: IUserEntity
  ): LoginResponseDTO {
    return {
      id: String(user._id),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: "agency_owner",
    };
  }
}
