export interface IDeletePackageUsecase {
  execute(packageId: string, agencyId: string): Promise<void>;
}


