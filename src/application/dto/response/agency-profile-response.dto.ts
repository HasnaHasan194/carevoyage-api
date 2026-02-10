export interface AgencyProfileResponseDTO {
  id: string;
  userId: string;
  agencyName: string;
  email: string;
  phone: string | null;
  registrationNumber: string;
  address: string;
  profileImage: string | null;
  description?: string;
  verificationStatus: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
