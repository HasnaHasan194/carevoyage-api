export interface IFulfillCaretakerRequestUseCase {
  execute(
    agencyId: string,
    requestId: string,
    data: { noteToClient?: string; caretakerId?: string }
  ): Promise<void>;
}
