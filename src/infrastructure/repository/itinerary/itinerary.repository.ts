import { ClientSession } from "mongoose";
import { ItineraryMapper } from "../../../application/mapper/itinerary.mapper";
import { IItineraryDayEntity, IItineraryEntity } from "../../../domain/entities/itinerary.entity";
import { IItineraryModel, itineraryDB } from "../../database/models/itinerary.model";
import { IItineraryRepository } from "../../../domain/repositoryInterfaces/Itinerary/itinerary.repository.interface";
import { BaseRepository } from "../baseRepository";

export class ItineraryRepository
  extends BaseRepository<IItineraryModel, IItineraryEntity>
  implements IItineraryRepository
{
  constructor() {
    super(itineraryDB, ItineraryMapper.toEntity);
  }

  async findByPackageId(
    packageId: string,
    session?: ClientSession
  ): Promise<IItineraryEntity | null> {
    const mongooseQuery = itineraryDB.findOne({ packageId });

    if (session) {
      mongooseQuery.session(session);
    }

    const itinerary = await mongooseQuery.exec();
    return itinerary ? ItineraryMapper.toEntity(itinerary) : null;
  }

  async updateDays(
    itineraryId: string,
    days: IItineraryDayEntity[],
    session?: ClientSession
  ): Promise<IItineraryEntity | null> {
    const mongooseQuery = itineraryDB.findByIdAndUpdate(
      itineraryId,
      { $set: { days } },
      { new: true }
    );

    if (session) {
      mongooseQuery.session(session);
    }

    const itinerary = await mongooseQuery.exec();
    return itinerary ? ItineraryMapper.toEntity(itinerary) : null;
  }
}

