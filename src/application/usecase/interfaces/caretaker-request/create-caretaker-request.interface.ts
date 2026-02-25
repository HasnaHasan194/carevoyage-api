export interface ICreateCaretakerRequestUseCase {
  execute(clientId: string, packageId: string): Promise<void>;
}
