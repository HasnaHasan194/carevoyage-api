export interface IVerifyAgencyUsecase {
  execute(agencyId: string): Promise<void>;
}
