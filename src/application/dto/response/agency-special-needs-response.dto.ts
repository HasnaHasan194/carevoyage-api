export class SpecialNeedMasterInfoDTO {
  id!: string;
  name!: string;
  shortCode?: string;
  description?: string;
}

export class AgencySpecialNeedsResponseDTO {
  id!: string;
  agencyId!: string;
  specialNeedId!: string;
  specialNeed?: SpecialNeedMasterInfoDTO;
  unit!: "per_day" | "per_trip";
  price!: number;
  isActive!: boolean;
  isDeleted!: boolean;
  deletedAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
