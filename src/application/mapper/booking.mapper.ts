import { IBookingEntity } from "../../domain/entities/booking.entity";
import type { IBookingModel } from "../../infrastructure/database/models/booking.model";

export class BookingMapper {
  static toEntity(doc: IBookingModel): IBookingEntity {
    return {
      _id: String(doc._id),
      bookingId: (doc as unknown as { bookingId?: string | null }).bookingId ?? undefined,
      clientId: String(doc.clientId),
      packageId: String(doc.packageId),
      agencyId: String(doc.agencyId),
      startDate: doc.startDate,
      basePrice: doc.basePrice,
      caretakerFee: doc.caretakerFee,
      specialNeedsFee: doc.specialNeedsFee,
      totalAmount: doc.totalAmount,
      currency: doc.currency,
      status: doc.status,
      stripeSessionId: doc.stripeSessionId ?? undefined,
      paidAt: doc.paidAt ?? undefined,
      cancellationReason: doc.cancellationReason ?? undefined,
      caretakerId: doc.caretakerId ? String(doc.caretakerId) : undefined,
      selectedSpecialNeedIds: doc.selectedSpecialNeedIds?.map((id: unknown) => String(id)) ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
