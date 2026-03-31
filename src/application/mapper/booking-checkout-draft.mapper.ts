import { IBookingCheckoutDraftEntity } from "../../domain/entities/booking-checkout-draft.entity";
import type { IBookingCheckoutDraftModel } from "../../infrastructure/database/models/booking-checkout-draft.model";

export class BookingCheckoutDraftMapper {
  static toEntity(doc: IBookingCheckoutDraftModel): IBookingCheckoutDraftEntity {
    return {
      _id: String(doc._id),
      clientId: String(doc.clientId),
      packageId: String(doc.packageId),
      agencyId: String(doc.agencyId),
      startDate: doc.startDate,
      endDate: doc.endDate,
      basePrice: doc.basePrice,
      caretakerFee: doc.caretakerFee,
      specialNeedsFee: doc.specialNeedsFee,
      totalAmount: doc.totalAmount,
      currency: doc.currency,
      caretakerId: doc.caretakerId ? String(doc.caretakerId) : undefined,
      selectedSpecialNeedIds:
        doc.selectedSpecialNeedIds?.map((id: unknown) => String(id)) ??
        undefined,
      stripeSessionId: doc.stripeSessionId ?? undefined,
      status: doc.status,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

