import { IItineraryEntity } from "../../domain/entities/itinerary.entity";
import { IItineraryModel } from "../../infrastructure/database/models/itinerary.model";
import {
  ItineraryResponseDTO,
  ItineraryDayResponseDTO,
} from "../dto/response/package-response.dto";
import { IActivityEntity } from "../../domain/entities/activity.entity";
import { ActivityMapper } from "./activity.mapper";

export class ItineraryMapper {
  static toEntity(doc: IItineraryModel): IItineraryEntity {
    return {
      _id: String(doc._id),
      packageId: String(doc.packageId),
      days: doc.days.map((day) => ({
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description,
        activities: day.activities.map((activityId) => String(activityId)),
        accommodation: day.accommodation,
        meals: {
          breakfast: day.meals.breakfast,
          lunch: day.meals.lunch,
          dinner: day.meals.dinner,
        },
        transfers: day.transfers,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toItineraryResponseDto(
    itineraryEntity: IItineraryEntity,
    activitiesMap?: Map<string, IActivityEntity>
  ): ItineraryResponseDTO {
    return {
      id: itineraryEntity._id,
      packageId: itineraryEntity.packageId,
      days: itineraryEntity.days.map((day) => {
        const dayResponse: ItineraryDayResponseDTO = {
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          activities: activitiesMap
            ? day.activities
                .map((activityId) => activitiesMap.get(activityId))
                .filter((activity): activity is IActivityEntity => activity !== undefined)
                .map((activity) => ActivityMapper.toActivityResponseDto(activity))
            : [],
          accommodation: day.accommodation,
          meals: {
            breakfast: day.meals.breakfast,
            lunch: day.meals.lunch,
            dinner: day.meals.dinner,
          },
          transfers: day.transfers,
        };
        return dayResponse;
      }),
      createdAt: itineraryEntity.createdAt,
      updatedAt: itineraryEntity.updatedAt,
    };
  }
}


