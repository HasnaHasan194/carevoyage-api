import { IAdminEntity } from "../../domain/entities/Admin.entity";
import { IAdminModel } from "../../infrastructure/database/models/admin.model";
import { LoginResponseDTO } from "../dto/response/login-response.dto";

export class AdminMapper {
  static toEntity(doc: IAdminModel): IAdminEntity {
    const admin: IAdminEntity = {
      _id: String(doc._id),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      password: doc.password,
      phone: doc.phone,
      gender: doc.gender,
      bio: doc.bio,
      profileImage: doc.profileImage,
      role: "admin",
      isBlocked: doc.isBlocked,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    return admin;
  }

  static mapToLoginResponseDto(
    admin: IAdminEntity
  ): LoginResponseDTO {
    return {
      id: String(admin._id),
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role, 
    };
  }
}
