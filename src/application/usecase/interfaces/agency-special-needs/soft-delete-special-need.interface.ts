export interface ISoftDeleteSpecialNeedUsecase {
  execute(id: string, agencyId: string): Promise<void>;
}
