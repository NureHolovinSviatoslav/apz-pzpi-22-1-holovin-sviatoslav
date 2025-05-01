import { UserRole } from "../types/User";

export const ACL = {
  vaccines: { allowedRoles: [UserRole.DBO, UserRole.Admin] },
  orders: { allowedRoles: [UserRole.DBO, UserRole.Admin, UserRole.Staff] },
  locations: { allowedRoles: [UserRole.DBO, UserRole.Admin, UserRole.Staff] },
  notifications: {
    allowedRoles: [UserRole.DBO, UserRole.Admin, UserRole.Staff],
  },
  sensorData: { allowedRoles: [UserRole.DBO, UserRole.Admin, UserRole.Staff] },
  backup: { allowedRoles: [UserRole.DBO] },
} satisfies Record<string, { allowedRoles: UserRole[] }>;
