export interface AssignedTripDTO {
  bookingId: string;
  packageName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
  tripDays?: number;
  pricePerDay?: number;
  income?: number;
}

export interface PaginatedCaretakerTripsResponseDTO {
  trips: AssignedTripDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalIncome: number;
}
