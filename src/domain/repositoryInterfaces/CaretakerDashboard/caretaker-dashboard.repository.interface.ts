export interface CaretakerDashboardStats {
  totalIncome: number;
  weeklyIncome: number;
  monthlyIncome: number;
  yearlyIncome: number;
  totalTrips: number;
  upcomingTripsCount: number;
  completedTripsCount: number;
}

export interface CaretakerNextTripRow {
  bookingId: string;
  packageName: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface CaretakerAssignedTripRow {
  bookingId: string;
  packageName: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  status: string;
  tripDays?: number;
  pricePerDay?: number;
  income?: number;
}

export interface ICaretakerDashboardRepository {
  getDashboardStats(caretakerId: string): Promise<CaretakerDashboardStats>;
  getNextTrip(caretakerId: string): Promise<CaretakerNextTripRow | null>;
  getAssignedTripsPaginated(
    caretakerId: string,
    page: number,
    limit: number
  ): Promise<{ trips: CaretakerAssignedTripRow[]; total: number; totalIncome: number }>;
}
