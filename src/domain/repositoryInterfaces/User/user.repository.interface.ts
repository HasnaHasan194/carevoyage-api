import { IUserEntity } from "../../../domain/entities/user.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IUserRepository extends IBaseRepository<IUserEntity> {
  findByEmail(email: string): Promise<IUserEntity | null>;
  findByPhone(phone: string): Promise<IUserEntity | null>;

  updatePassword(id: string, newPassword: string): Promise<IUserEntity | null>;
  //   findAll(
  //   page: number,
  //   limit: number
  // ): Promise<{ users: IUserEntity[]; total: number }>;

  updateBlockStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<void>;

  findAllWithSearch(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: IUserEntity[]; total: number }>;

  findById(userId: string): Promise<IUserEntity | null>;
}
// findByRole(
  //   role: IUserEntity["role"],
  //   pageNumber: number,
  //   pageSize: number
  // ): Promise<{ users: IUserEntity[]; total: number }>;