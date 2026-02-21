export interface IDeleteAgencySpecialNeedsMasterUsecase {
  execute(id: string, agencyId: string): Promise<void>;
}
