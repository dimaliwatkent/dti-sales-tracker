import { User } from "./UserType";
/**
 * Interface for business data
 */
export interface Business {
  _id: string;
  user: User;
  event: string;
  saleList: string[];
  customProductList: string[];
  violationList: string[];
  awardList: string[];

  // Business Details
  name: string;
  address: string;
  logo: string;
  facebookPage: string;
  ecommerceSite: string;
  website: string;
  paymentOption: string[];
  logisticServiceProvider: string;
  industryClassification: string[];
  productLineService: string;
  product: string;
  brandName: string;
  category: string[];
  documentList: string[];
  type: string;

  // Business Statistics
  assetSize: number;
  targetSale: number;
  fulltimeEmployee: number;
  parttimeEmployee: number;
  dateOfEstablishment: string;
  annualIncome: number;

  // Status
  isOccupying: boolean;
  boothNumber: number;
  applicationStatus: string;
  statusMessage: String;
  isArchived: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
