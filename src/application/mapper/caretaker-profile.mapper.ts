import { ICaretakerProfileEntity } from "../../domain/entities/caretaker-profile.entity";
import { ICaretakerProfileModel } from "../../infrastructure/database/schemas/caretaker-profile.schema";

export class CaretakerProfileMapper {
  static toEntity(doc: ICaretakerProfileModel): ICaretakerProfileEntity {
    return {
      _id: String(doc._id),
      userId: doc.userId ? String(doc.userId) : undefined,
      agencyId: String(doc.agencyId),
      email: doc.email,
      nationality: doc.nationality || "",
      alternatePhone: doc.alternatePhone,
      dob: doc.dob,
      languages: doc.languages,
      experienceYears: doc.experienceYears,
      profileImage: doc.profileImage,
      documents: doc.documents,
      status: doc.status,
      kycDocs: doc.kycDocs,
      rating: doc.rating,
      reviewCount: doc.reviewCount,
      joinedAt: doc.joinedAt,
      address: doc.address
        ? {
            street: doc.address.street || "",
            city: doc.address.city || "",
            state: doc.address.state || "",
            postalCode: doc.address.postalCode || "",
            country: doc.address.country || "",
          }
        : {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

