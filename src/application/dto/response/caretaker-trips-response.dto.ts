export interface CaretakerTripItemDTO {
  bookingId: string;
  packageName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
  dailyWage: number;
  totalIncome: number;
}

export interface PaginatedCaretakerTripsResponseDTO {
  items: CaretakerTripItemDTO[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

