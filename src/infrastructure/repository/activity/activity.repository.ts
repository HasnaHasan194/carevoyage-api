import { ClientSession } from "mongoose";
import { ActivityMapper } from "../../../application/mapper/activity.mapper";
import { IActivityEntity } from "../../../domain/entities/activity.entity";
import { IActivityModel, activityDB } from "../../database/models/activity.model";
import { IActivityRepository } from "../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { BaseRepository } from "../baseRepository";

export class ActivityRepository
  extends BaseRepository<IActivityModel, IActivityEntity>
  implements IActivityRepository
{
  constructor() {
    super(activityDB, ActivityMapper.toEntity, ActivityMapper.toModel);
  }

  async findByPackageId(
    packageId: string,
    session?: ClientSession
  ): Promise<IActivityEntity[]> {
    const query = activityDB.find({ packageId });

    if (session) {
      query.session(session);
    }

    const activities = await query.exec();
    return activities.map((activity) => ActivityMapper.toEntity(activity));
  }

  async findByIds(
    activityIds: string[],
    packageId: string,
    session?: ClientSession
  ): Promise<IActivityEntity[]> {
    const query = activityDB.find({
      _id: { $in: activityIds },
      packageId, 
    });

    if (session) {
      query.session(session);
    }

    const activities = await query.exec();
    return activities.map((activity) => ActivityMapper.toEntity(activity));
  }

  async saveMany(
    activities: Partial<IActivityEntity>[],
    session?: ClientSession
  ): Promise<IActivityEntity[]> {
    const modelDataArray = activities.map((activity) =>
      ActivityMapper.toModel(activity)
    );

    const options = session ? { session } : {};
    const savedDocs = await activityDB.insertMany(modelDataArray, options);

    return savedDocs.map((doc) => ActivityMapper.toEntity(doc));
  }

  async findAll(session?: ClientSession): Promise<IActivityEntity[]> {
    const query = activityDB.find({});

    if (session) {
      query.session(session);
    }

    const activities = await query.exec();
    return activities.map((activity) => ActivityMapper.toEntity(activity));
  }

  async findByCategory(
    category: string,
    session?: ClientSession
  ): Promise<IActivityEntity[]> {
    const query = activityDB.find({ category });

    if (session) {
      query.session(session);
    }

    const activities = await query.exec();
    return activities.map((activity) => ActivityMapper.toEntity(activity));
  }
}

