export type TWalletOwnerType = "USER" | "AGENCY" | "ADMIN";

export interface IWalletEntity {
  _id: string;
  ownerId: string;
  ownerType: TWalletOwnerType;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

