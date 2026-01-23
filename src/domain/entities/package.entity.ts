export type TPackageStatus = "draft" | "published" | "completed" | "cancelled";

export interface IPackageEntity {
  _id: string;
  agencyId: string;
  PackageName: string;
  description: string;
  category: string;
  tags: string[];
  status: TPackageStatus;
  meetingPoint: string;
  images: string[];
  maxGroupSize: number;
  basePrice: number;
  startDate: Date;
  endDate: Date;
  itineraryId?: string;
  inclusions: string[];
  exclusions: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

