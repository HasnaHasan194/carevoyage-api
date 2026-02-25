export interface AvailableCaretakerDTO {
  id: string;
  name: string;
  profileImage?: string;
  languages: string[];
  experienceYears: number;
  pricePerDay: number;
  status: string;
  verificationStatus?: string;
}

export interface IGetAvailableCaretakersForBookingUseCase {
  execute(packageId: string): Promise<AvailableCaretakerDTO[]>;
}
