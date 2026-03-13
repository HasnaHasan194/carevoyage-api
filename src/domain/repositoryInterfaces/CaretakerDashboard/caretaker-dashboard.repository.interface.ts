export interface CaretakerDashboardStats {
  totalIncome: number;
  weeklyIncome: number;
  monthlyIncome: number;
  yearlyIncome: number;
  totalTrips: number;
  upcomingTripsCount: number;
  completedTripsCount: number;
}

export interface CaretakerNextTrip {
  bookingId: string;
  packageName: string;
  clientName: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface ICaretakerDashboardRepository {
  getDashboardStats(caretakerProfileId: string): Promise<CaretakerDashboardStats>;
  getNextTrip(caretakerProfileId: string): Promise<CaretakerNextTrip | null>;
}

