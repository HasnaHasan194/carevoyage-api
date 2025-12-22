import { IBaseRepository } from "../baseRepository.interface";
import { IAdminEntity } from "../../entities/Admin.entity";

export interface IAdminRepository
  extends IBaseRepository<IAdminEntity> {
  findByEmail(email: string): Promise<IAdminEntity | null>;
  findByNumber(phone: string): Promise<IAdminEntity | null>;
}
