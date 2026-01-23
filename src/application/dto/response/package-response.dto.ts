export interface ActivityResponseDTO {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  priceIncluded: boolean;
}

export interface ItineraryDayResponseDTO {
  dayNumber: number;
  title: string;
  description: string;
  activities: ActivityResponseDTO[];
  accommodation: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  transfers: string[];
}

export interface ItineraryResponseDTO {
  id: string;
  packageId: string;
  days: ItineraryDayResponseDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PackageResponseDTO {
  id: string;
  agencyId: string;
  PackageName: string;
  description: string;
  category: string;
  tags: string[];
  status: "draft" | "published" | "completed" | "cancelled";
  meetingPoint: string;
  images: string[];
  maxGroupSize: number;
  basePrice: number;
  startDate: Date;
  endDate: Date;
  itineraryId?: string;
  itinerary?: ItineraryResponseDTO;
  inclusions: string[];
  exclusions: string[];
  createdAt: Date;
  updatedAt: Date;
}


