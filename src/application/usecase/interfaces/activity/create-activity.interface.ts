import { CreateActivityRequestDTO } from "../../../dto/request/create-activity-request.dto";
import { ActivityResponseDTO } from "../../../dto/response/package-response.dto";

export interface ICreateActivityUsecase {
  execute(data: CreateActivityRequestDTO): Promise<ActivityResponseDTO>;
}





