export interface IAgencySpecialNeedsMasterEntity {
  _id: string;
  agencyId: string;
  name: string;
  description?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
