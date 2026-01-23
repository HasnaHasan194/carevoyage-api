import { inject, injectable } from "tsyringe";
import { ICreateActivityUsecase } from "../../interfaces/activity/create-activity.interface";
import { CreateActivityRequestDTO } from "../../../dto/request/create-activity-request.dto";
import { ActivityResponseDTO } from "../../../dto/response/package-response.dto";
import { IActivityRepository } from "../../../../domain/repositoryInterfaces/Activity/activity.repository.interface";
import { ActivityMapper } from "../../../mapper/activity.mapper";

@injectable()
export class CreateActivityUsecase implements ICreateActivityUsecase {
  constructor(
    @inject("IActivityRepository")
    private _activityRepository: IActivityRepository
  ) {}

  async execute(data: CreateActivityRequestDTO): Promise<ActivityResponseDTO> {
    const activityEntity = await this._activityRepository.save({
      name: data.name,
      description: data.description,
      duration: data.duration,
      category: data.category,
      priceIncluded: data.priceIncluded ?? false,
    });

    return ActivityMapper.toActivityResponseDto(activityEntity);
  }
}


