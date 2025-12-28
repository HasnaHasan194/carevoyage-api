import { VerifyCaretakerInviteResponseDTO } from "../../../dto/response/verify-invite-response.dto";

export interface IVerifyCaretakerInviteUseCase {
  execute(token: string): Promise<VerifyCaretakerInviteResponseDTO>;
}



