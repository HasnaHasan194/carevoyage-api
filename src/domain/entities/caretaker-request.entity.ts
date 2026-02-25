export type TCaretakerRequestStatus = "pending" | "fulfilled" | "cancelled";

export interface ICaretakerRequestEntity {
  _id: string;
  clientId: string;
  packageId: string;
  agencyId: string;
  status: TCaretakerRequestStatus;
  requestedAt: Date;
  fulfilledAt?: Date;
  fulfilledByCaretakerId?: string;
  agencyNoteToClient?: string;
  createdAt: Date;
  updatedAt: Date;
}
