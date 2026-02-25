import { ICaretakerRequestEntity } from "../../domain/entities/caretaker-request.entity";
import type { ICaretakerRequestModel } from "../../infrastructure/database/models/caretaker-request.model";

export class CaretakerRequestMapper {
  static toEntity(doc: ICaretakerRequestModel): ICaretakerRequestEntity {
    return {
      _id: String(doc._id),
      clientId: String(doc.clientId),
      packageId: String(doc.packageId),
      agencyId: String(doc.agencyId),
      status: doc.status,
      requestedAt: doc.requestedAt,
      fulfilledAt: doc.fulfilledAt ?? undefined,
      fulfilledByCaretakerId: doc.fulfilledByCaretakerId
        ? String(doc.fulfilledByCaretakerId)
        : undefined,
      agencyNoteToClient: doc.agencyNoteToClient ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
