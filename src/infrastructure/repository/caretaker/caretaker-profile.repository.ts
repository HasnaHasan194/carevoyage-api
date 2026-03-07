import { CaretakerProfileMapper } from "../../../application/mapper/caretaker-profile.mapper";
import { ICaretakerProfileEntity } from "../../../domain/entities/caretaker-profile.entity";
import { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import {
  caretakerProfileDB,
} from "../../database/models/caretaker-profile.model";
import { ICaretakerProfileModel } from "../../database/schemas/caretaker-profile.schema";
import { BaseRepository } from "../baseRepository";

export class CaretakerProfileRepository
  extends BaseRepository<ICaretakerProfileModel, ICaretakerProfileEntity>
  implements ICaretakerProfileRepository
{
  constructor() {
    super(caretakerProfileDB, CaretakerProfileMapper.toEntity);
  }

  async findByAgencyId(
    agencyId: string
  ): Promise<ICaretakerProfileEntity[]> {
    const docs = await caretakerProfileDB.find({ agencyId }).exec();
    return docs.map((doc) => CaretakerProfileMapper.toEntity(doc));
  }

  async findByAgencyIdPaginated(
    agencyId: string,
    page: number,
    limit: number
  ): Promise<ICaretakerProfileEntity[]> {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    const docs = await caretakerProfileDB
      .find({ agencyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .exec();

    return docs.map((doc) => CaretakerProfileMapper.toEntity(doc));
  }

  async countByAgencyId(agencyId: string): Promise<number> {
    return caretakerProfileDB.countDocuments({ agencyId }).exec();
  }

  async findByUserId(
    userId: string
  ): Promise<ICaretakerProfileEntity | null> {
    const doc = await caretakerProfileDB.findOne({ userId }).exec();
    return doc ? CaretakerProfileMapper.toEntity(doc) : null;
  }

  async findByEmailAndAgencyId(
    email: string,
    agencyId: string
  ): Promise<ICaretakerProfileEntity | null> {
    const doc = await caretakerProfileDB
      .findOne({ email, agencyId })
      .exec();
    return doc ? CaretakerProfileMapper.toEntity(doc) : null;
  }

  async updateStatus(
    profileId: string,
    status: "invited" | "active" | "blocked"
  ): Promise<ICaretakerProfileEntity | null> {
    const doc = await caretakerProfileDB
      .findByIdAndUpdate(
        profileId,
        { $set: { status } },
        { new: true }
      )
      .exec();

    return doc ? CaretakerProfileMapper.toEntity(doc) : null;
  }

  async updateAvailabilityStatus(
    profileId: string,
    availabilityStatus: "AVAILABLE" | "BUSY" | "INACTIVE"
  ): Promise<ICaretakerProfileEntity | null> {
    const doc = await caretakerProfileDB
      .findByIdAndUpdate(
        profileId,
        { $set: { availabilityStatus } },
        { new: true }
      )
      .exec();

    return doc ? CaretakerProfileMapper.toEntity(doc) : null;
  }

  async softDelete(profileId: string): Promise<ICaretakerProfileEntity | null> {
    const doc = await caretakerProfileDB
      .findByIdAndUpdate(
        profileId,
        { $set: { isDeleted: true, availabilityStatus: "INACTIVE" } },
        { new: true }
      )
      .exec();

    return doc ? CaretakerProfileMapper.toEntity(doc) : null;
  }

  async activateProfile(
    profileId: string,
    userId: string
  ): Promise<ICaretakerProfileEntity | null> {
    const doc = await caretakerProfileDB
      .findByIdAndUpdate(
        profileId,
        {
          $set: {
            userId,
            status: "active",
            joinedAt: new Date(),
            email: null, // Clear email after signup since we now have userId
          },
        },
        { new: true }
      )
      .exec();

    return doc ? CaretakerProfileMapper.toEntity(doc) : null;
  }

  async getVerificationStatus(
    userId: string
  ): Promise<"pending" | "verified" | "rejected" | null> {
    const profile = await this.findByUserId(userId);
    return profile?.verificationStatus || null;
  }

  async updatePricePerDay(
    profileId: string,
    pricePerDay: number
  ): Promise<ICaretakerProfileEntity | null> {
    const doc = await caretakerProfileDB
      .findByIdAndUpdate(
        profileId,
        { $set: { pricePerDay } },
        { new: true }
      )
      .exec();

    return doc ? CaretakerProfileMapper.toEntity(doc) : null;
  }
}

