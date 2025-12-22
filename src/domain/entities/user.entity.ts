export interface IUserEntity {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  bio?: string;
  country?: string;
  profileImage?: string;
  role: "client" | "caretaker" | "agency_owner" | "admin";
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
