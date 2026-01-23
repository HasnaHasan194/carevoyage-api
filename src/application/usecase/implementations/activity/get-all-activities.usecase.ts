import { inject, injectable } from "tsyringe";
import { IGetAllActivitiesUsecase } from "../../interfaces/activity/get-all-activities.interface";
import { ActivityResponseDTO } from "../../../dto/response/package-response.dto";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { IActivityEntity } from "../../../../domain/entities/activity.entity";
import { ActivityMapper } from "../../../mapper/activity.mapper";

@injectable()
export class GetAllActivitiesUsecase implements IGetAllActivitiesUsecase {
  constructor(
    @inject("IActivityRepository")
    private _activityRepository: IActivityRepository
  ) {}

  async execute(category?: string): Promise<ActivityResponseDTO[]> {
    const activities = category
      ? await this._activityRepository.findByCategory(category)
      : await this._activityRepository.findAll();

    return activities.map((activity: IActivityEntity) =>
      ActivityMapper.toActivityResponseDto(activity)
    );
  }
}


