import { CaretakerVerificationRequestDTO } from "../../../dto/request/caretaker-verification-request.dto";

export interface ISubmitCaretakerVerificationUsecase {
  execute(userId: string, data: CaretakerVerificationRequestDTO): Promise<void>;
}





