export interface CaretakerBasicInfoDTO {
  caretakerId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  availabilityStatus: "AVAILABLE" | "BUSY" | "INACTIVE";
}

export interface CaretakerIncomeOverviewDTO {
  totalIncome: number;
  weeklyIncome: number;
  monthlyIncome: number;
  yearlyIncome: number;
}

export interface CaretakerNextTripDTO {
  bookingId: string;
  packageName: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface CaretakerDashboardResponseDTO {
  basicInfo: CaretakerBasicInfoDTO;
  dailyWage: number;
  income: CaretakerIncomeOverviewDTO;
  totalTrips: number;
  upcomingTripsCount: number;
  completedTripsCount: number;
  nextTrip: CaretakerNextTripDTO | null;
}
