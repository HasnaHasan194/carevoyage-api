export interface IRejectAgencyUsecase {
  execute(agencyId: string, reason: string): Promise<void>;
}
