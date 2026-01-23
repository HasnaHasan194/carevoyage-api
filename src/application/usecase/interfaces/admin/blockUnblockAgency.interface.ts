export interface IBlockUnblockAgencyUsecase {
  execute(agencyId: string, isBlocked: boolean): Promise<void>;
}


