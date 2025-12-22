import { InviteCaretakerRequestDTO } from "../../../dto/request/invite-caretaker-request.dto";

export interface IInviteCaretakerUseCase {
  execute(
    agencyId: string,
    request: InviteCaretakerRequestDTO
  ): Promise<void>;
}

