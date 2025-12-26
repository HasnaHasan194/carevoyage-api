import { UserMapper } from "../../../application/mapper/user.mapper";
import { IUserEntity } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositoryInterfaces/User/user.repository.interface";
import { IUserModel, userDB } from "../../database/models/client.model";
import { BaseRepository } from "../baseRepository";

export class UserRepository
  extends BaseRepository<IUserModel, IUserEntity>
  implements IUserRepository
{

  constructor(){
    super(userDB,UserMapper.toEntity)
  }
  async findByEmail(email: string): Promise<IUserEntity | null> {
    return await userDB.findOne({ email });
  }

  async findByPhone(phone: string): Promise<IUserEntity | null> {
    return await userDB.findOne({ phone });
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<void> {
    const result = await userDB.updateOne(
      { _id: id },
      { $set: { isBlocked } }
    );
    
    if (result.matchedCount === 0) {
      throw new Error("User not found");
    }
  }

  async findAllWithSearch(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: IUserEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    

 
    const matchConditions: Record<string, unknown> = {role : "client"};
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      matchConditions.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }


    const [users, total] = await Promise.all([
      userDB
        .find(matchConditions)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      userDB.countDocuments(matchConditions),
    ]);

    return {
      users: users.map((user) => UserMapper.toEntity(user)),
      total,
    };
  }

  async findById(userId: string): Promise<IUserEntity | null> {
    const user = await userDB.findById(userId);
    if (!user) return null;
    return UserMapper.toEntity(user);
  }

  async updatePassword(
    id: string,
    newPassword: string
  ): Promise<IUserEntity | null> {
    return await userDB.findByIdAndUpdate(
      id,
      {
        $set: { password: newPassword },
      },
      { new: true }
    );
  }

  // async countNumberOfCom() : Promise<number>{
  //    const date = new Date();
  //    const data = await userDB.find({createdAt : date,role : "agency_owner " }).countDocuments();
  //    return data;
  // }


//   async findByRole(
//     role: IUserEntity["role"],
//     pageNumber: number,
//     pageSize: number
//   ): Promise<{ users: IUserEntity[]; total: number }> {}
}
