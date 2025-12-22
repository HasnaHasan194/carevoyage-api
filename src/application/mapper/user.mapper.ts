import { IUserEntity } from "../../domain/entities/user.entity";
import { IUserModel } from "../../infrastructure/database/models/client.model";
import { LoginResponseDTO } from "../dto/response/login-response.dto";


export class UserMapper {
  static toEntity(doc: IUserModel): IUserEntity {
    const user: IUserEntity = {
      _id: String(doc._id),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      password: doc.password,
      gender: doc.gender,
      role: doc.role,
      profileImage: doc.profileImage,
      isBlocked: doc.isBlocked,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };

    if (doc.bio) {
      user.bio = doc.bio;
    }

    return user;
  }

  static mapToLoginResponseDto(doc: IUserEntity): LoginResponseDTO {
    return {
      id: String(doc._id),
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      role: doc.role,
    };
  }

  static toUserResponseDto(doc: IUserEntity): {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    profileImage?: string;
  } {
    return {
      id: String(doc._id),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      role: doc.role,
      isBlocked: doc.isBlocked,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      profileImage: doc.profileImage,
    };
  }
}
  