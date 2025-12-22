import { IUserEntity } from "./user.entity";

// export type TVerificationStatus = "pending" | "verified" | "rejected";

// export interface IAgencyEntity extends IUserEntity {
//   _id : string;
//   userId: string;
//   agencyName: string;
//   address: string;
//   registrationNumber: string;
//   kycDocs: string[];
//   verificationStatus: TVerificationStatus;
//   description?: string;
//   isBlocked: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

export type TVerificationStatus = "pending" | "verified" | "rejected";

export interface IAgencyEntity {
  _id: string;
  userId: string;
  agencyName: string;
  address: string;
  registrationNumber: string;
  kycDocs: string[];
  verificationStatus: TVerificationStatus;
  description?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
