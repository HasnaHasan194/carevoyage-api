import { IUserEntity } from "../../domain/entities/user.entity";
import { UserProfileResponseDTO } from "../dto/response/user-profile-response.dto";

export class UserProfileMapper {
  static toDTO(user: IUserEntity): UserProfileResponseDTO {
    return {
      id: user._id,

      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,

      phone: user.phone ?? undefined,
      gender: user.gender ?? undefined,
      bio: user.bio ?? undefined,
      country: user.country ?? undefined,
      profileImage: user.profileImage ?? undefined,

      role: user.role,

      createdAt: user.createdAt,
    };
  }
}
