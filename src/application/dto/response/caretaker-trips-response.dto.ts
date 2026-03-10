export interface AssignedTripDTO {
  bookingId: string;
  packageName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface PaginatedCaretakerTripsResponseDTO {
  trips: AssignedTripDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
