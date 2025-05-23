export enum UserRole {
  Admin = "admin",
  Staff = "staff",
  IoT = "iot",
  DBO = "dbo",
}

export type User = {
  username: string;
  password: string;
  role: UserRole | null;
  phone: string;
};
