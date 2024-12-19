import { ProductType } from "./Product";
import { UserType } from "./UserType";
import { BusinessViolation } from "./ViolationType";
/**
 * Interface for business data
 */
export interface BusinessShortType {
  _id: string;
  name: string;
  totalSales: number;
}

export interface BusinessType {
  _id: string;
  user: UserType;
  event: string;
  saleList: string[];
  customProductList: string[];
  violationList: string[];
  awardList: string[];

  // Business Details
  name: string;
  address: string;
  region: string;
  zip: string;
  logo: string;
  facebookPage: string;
  ecommerceSite: string;
  website: string;
  contactPersonName: string;
  contactPersonNumber: Number;
  contactPersonDesignation: string;
  contactPersonSex: string;
  paymentOption: string[];
  logisticServiceProvider: string[];
  industryClassification: string[];
  productLineService: string[];
  brandName: string;
  category: string[];
  documentList: {
    documentType: string;
    url: string;
    _id: string;
  }[];
  type: string;
  productList: ProductType[];

  // Business Statistics
  assetSize: string;
  fulltimeEmployee: number;
  parttimeEmployee: number;
  dateOfEstablishment: string;
  annualIncome: number;

  // Status
  isOccupying: boolean;
  boothNumber: string;
  applicationStatus: string;
  statusMessage: String;
  isArchived: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessWithViolation {
  _id: string;
  user: UserType;
  event: string;
  violationList: BusinessViolation[];

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
  documentList: {
    documentType: string;
    url: string;
    _id: string;
  }[];
  type: string;
  productList: ProductType[];

  // Business Statistics
  assetSize: number;
  targetSale: number;
  fulltimeEmployee: number;
  parttimeEmployee: number;
  dateOfEstablishment: string;
  annualIncome: number;

  // Status
  isOccupying: boolean;
  boothNumber: string;
  applicationStatus: string;
  statusMessage: String;
  isArchived: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessListViolationType {
  _id: string;
  name: string;
  boothNumber: string;
  violationList: string[];
}
