export interface IReverifyAgencyUsecase {
  execute(token: string): Promise<void>;
}
