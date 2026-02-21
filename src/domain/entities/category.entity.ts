export interface ICategoryEntity {
  _id: string;
  name: string;
  agencyId: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
