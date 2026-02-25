export interface CaretakerRequestListItemDTO {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  packageId: string;
  packageName: string;
  agencyId: string;
  status: string;
  requestedAt: Date;
  fulfilledAt?: Date;
  agencyNoteToClient?: string;
}
