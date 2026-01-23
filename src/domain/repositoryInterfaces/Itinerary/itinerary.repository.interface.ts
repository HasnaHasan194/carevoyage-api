import { ClientSession } from "mongoose";
import { IItineraryDayEntity, IItineraryEntity } from "../../entities/itinerary.entity";
import { IBaseRepository } from "../baseRepository.interface";

export interface IItineraryRepository extends IBaseRepository<IItineraryEntity> {
  findByPackageId(
    packageId: string,
    session?: ClientSession
  ): Promise<IItineraryEntity | null>;

  updateDays(
    itineraryId: string,
    days: IItineraryDayEntity[],
    session?: ClientSession
  ): Promise<IItineraryEntity | null>;
}

