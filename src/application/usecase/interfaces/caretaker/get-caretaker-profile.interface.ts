import { CaretakerProfileResponseDTO } from "../../../dto/response/caretaker-profile-response.dto";

export interface IGetCaretakerProfileUsecase {
  execute(userId: string): Promise<CaretakerProfileResponseDTO>;
}




