import { ActivityResponseDTO } from "../../../dto/response/package-response.dto";

export interface IGetAllActivitiesUsecase {
  execute(category?: string): Promise<ActivityResponseDTO[]>;
}


