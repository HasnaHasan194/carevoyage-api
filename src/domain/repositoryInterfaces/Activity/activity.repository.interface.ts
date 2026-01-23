import { ClientSession } from "mongoose";
import { IActivityEntity } from "../../entities/activity.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IActivityRepository extends IBaseRepository<IActivityEntity> {
  findByPackageId(
    packageId: string,
    session?: ClientSession
  ): Promise<IActivityEntity[]>;

  findByIds(
    activityIds: string[],
    packageId: string,
    session?: ClientSession
  ): Promise<IActivityEntity[]>;

  saveMany(
    activities: Partial<IActivityEntity>[],
    session?: ClientSession
  ): Promise<IActivityEntity[]>;

  findAll(session?: ClientSession): Promise<IActivityEntity[]>;

  findByCategory(
    category: string,
    session?: ClientSession
  ): Promise<IActivityEntity[]>;
}

