import { injectable } from "tsyringe";
import { IAdminEntity } from "../../../domain/entities/Admin.entity";
import { IAdminRepository } from "../../../domain/repositoryInterfaces/Admin/admin.repository.interface";
import { adminDB,IAdminModel } from "../../database/models/admin.model";
import { BaseRepository } from "../baseRepository";
@injectable()
export class AdminRepository extends BaseRepository<IAdminModel, IAdminEntity>
  implements IAdminRepository
{
  constructor() {
    super(adminDB);
  }

  async findByEmail(email: string): Promise<IAdminEntity | null> {
    
    const admin = await adminDB.findOne({ email }).exec();
    return admin as unknown as IAdminEntity;
  }

  async findByNumber(phone: string): Promise<IAdminEntity | null> {
    const admin = await adminDB.findOne({ phone }).exec();
    return admin as unknown as IAdminEntity;
  }

  async updatePassword(
    id: string,
    newPassword: string
  ): Promise<IAdminEntity | null> {
    const admin = await adminDB.findByIdAndUpdate(
      id,
      {
        $set: { password: newPassword },
      },
      { new: true }
    ).exec();
    return admin as unknown as IAdminEntity;
  }
}