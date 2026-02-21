import { TVerificationStatus } from "../../../domain/entities/Agency.entity";

export interface AgencyResponseDTO {
  id: string;
  userId: string;
  agencyName: string;
  address: string;
  registrationNumber: string;
  kycDocs: string[];
  verificationStatus: TVerificationStatus;
  rejectionReason?: string;
  description?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerEmail?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerProfileImage?: string;
}

export interface PaginatedAgenciesResponseDTO {
  agencies: AgencyResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}





