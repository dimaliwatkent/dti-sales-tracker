import { Business } from "./BusinessType";
/**
 * Interface for user data
 */
export interface User {
  _id: string;
  businessList: Business[];
  name: string;
  email: string;
  phoneNumber: number;
  role: string;
  refreshToken?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBusiness {
  _id: string;
  business: [
    {
      _id: string;
      name: string;
    },
  ];
  name: string;
  email: string;
  phoneNumber: number;
  role: string;
  refreshToken?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create and update types can be defined using utility types
export type CreateUser = Omit<User, "business" | "refreshToken" | "isArchived">;
export type UpdateUser = Partial<User>;
