export interface IAgencySpecialNeedsEntity {
  _id: string;
  agencyId: string;
  specialNeedId: string;
  unit: "per_day" | "per_trip";
  price: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
