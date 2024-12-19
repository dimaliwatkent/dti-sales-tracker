import { BusinessType } from "./BusinessType";
/**
 * Interface for user data
 */
export interface UserType {
  _id: string;
  businessList: BusinessType[];
  name: string;
  email: string;
  phoneNumber: number;
  role: string;
  picture: string;
  businessName: string;
  document: string;
  dtiRegistrationNumber: number;
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
  picture: string;
  businessName: string;
  document: string;
  refreshToken?: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
