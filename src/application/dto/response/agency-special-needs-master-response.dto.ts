export class AgencySpecialNeedsMasterResponseDTO {
  id!: string;
  agencyId!: string;
  name!: string;
  description?: string;
  isDeleted!: boolean;
  deletedAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
