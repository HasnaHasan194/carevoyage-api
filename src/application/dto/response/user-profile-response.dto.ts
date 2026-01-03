export class UserProfileResponseDTO {
  id!: string;

  firstName!: string;
  lastName!: string;
  email!: string;

  phone?: string;
  gender?: string;
  bio?: string;
  country?: string;
  profileImage?: string;

  role!: "client" | "caretaker" | "agency_owner" | "admin";

  createdAt!: Date;
}
