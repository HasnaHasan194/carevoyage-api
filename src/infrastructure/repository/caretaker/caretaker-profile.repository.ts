import { CaretakerProfileMapper } from "../../../application/mapper/caretaker-profile.mapper";
import { ICaretakerProfileEntity } from "../../../domain/entities/caretaker-profile.entity";
import { ICaretakerProfileRepository } from "../../../domain/repositoryInterfaces/Caretaker/caretaker-profile.repository.interface";
import {
  ICaretakerProfileModel,
  caretakerProfileDB,
} from "../../database/models/caretaker-profile.model";
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
          },
        },
        { new: true }
      )
      .exec();

    return doc ? CaretakerProfileMapper.toEntity(doc) : null;
  }
}

