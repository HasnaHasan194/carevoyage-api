import { inject, injectable } from "tsyringe";
import { IUpdateUserProfileUsecase } from "../../interfaces/user/update-user-profile.interface";
import { UpdateUserProfileRequestDTO } from "../../../dto/request/update-user-profile-request.dto";
import { IUserRepository } from "../../../../domain/repositoryInterfaces/User/user.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";
import { ValidationError } from "../../../../domain/errors/validationError";
import { IUserEntity } from "../../../../domain/entities/user.entity";
import { ERROR_MESSAGE } from "../../../../shared/constants/constants";

@injectable()
export class UpdateUserProfileUsecase implements IUpdateUserProfileUsecase {
  constructor(
    @inject("IUserRepository")
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(
    userId: string,
    data: UpdateUserProfileRequestDTO
  ): Promise<IUserEntity> {
    // Verify user exists
    const existingUser = await this._userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND);
    }

    
    const updateData: Partial<IUserEntity> = {};
    
    if (data.firstName !== undefined) {
      updateData.firstName = data.firstName.trim();
    }
    if (data.lastName !== undefined) {
      updateData.lastName = data.lastName.trim();
    }
    if (data.phone !== undefined) {
      const trimmedPhone = data.phone.trim();
      // Check phone uniqueness if phone is being updated
      if (trimmedPhone && trimmedPhone !== existingUser.phone) {
        const phoneExists = await this._userRepository.findByPhone(trimmedPhone);
        if (phoneExists && phoneExists._id !== userId) {
          throw new ValidationError(ERROR_MESSAGE.USER.PHONE_ALREADY_IN_USE);
        }
      }
      updateData.phone = trimmedPhone || undefined;
    }
    if (data.gender !== undefined) {
      updateData.gender = data.gender;
    }
    if (data.bio !== undefined) {
      updateData.bio = data.bio.trim() || undefined;
    }
    if (data.profileImage !== undefined) {
      updateData.profileImage = data.profileImage || undefined;
    }

   
    const updatedUser = await this._userRepository.updateById(userId, updateData);
    
    if (!updatedUser) {
      throw new NotFoundError(ERROR_MESSAGE.USER.NOT_FOUND_AFTER_UPDATE);
    }

    return updatedUser;
  }
}
