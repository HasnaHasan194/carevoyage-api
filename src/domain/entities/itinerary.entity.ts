export interface IItineraryDayEntity {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[]; 
  accommodation: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  transfers: string[];
}

export interface IItineraryEntity {
  _id: string;
  packageId: string;
  days: IItineraryDayEntity[];
  createdAt: Date;
  updatedAt: Date;
}


