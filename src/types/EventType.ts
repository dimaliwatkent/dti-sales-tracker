import { BusinessType, BusinessWithViolation } from "./BusinessType";
import { BoothType } from "./BoothType";
/**
 * Interface for event data
 */

export interface EventShortType {
  _id: string;
  title: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

export interface EventWithBusinessType {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalEventSales: { $numberDecimal: string };
  businessList: {
    _id: string;
    name: string;
    totalSales: { $numberDecimal: string };
  }[];
  boothList: BoothType[];
  isLocal: boolean;
  businessCount: {
    applicant: number;
    rejected: number;
  };
}

export interface EventPopulatedType {
  _id: string;
  business?: BusinessType;
  businessList: BusinessType[];
  applicantList: BusinessType[];
  title: string;
  location: string;
  documentList: { filename: string; url: string }[];
  startDate: string;
  endDate: string;
  applicationStart: string;
  applicationEnd: string;
  status: string;

  isLocal: boolean;
  boothList: BoothType[];
  isArchived: boolean;
}

export interface EventType {
  _id: string;
  businessList: string[];
  applicantList: string[];
  title: string;
  logo: string;
  location: string;
  documentList: { filename: string; url: string }[];
  startDate: string;
  endDate: string;
  applicationStart: string;
  applicationEnd: string;
  status: string;
  boothList: BoothType[];
  isLocal: boolean;
  isArchived: boolean;
}

export interface EventBusiness {
  _id: string;
  businessList: BusinessType[];
  applicantList: BusinessType[];
  business: BusinessType;
  title: string;
  logo: string;
  location: string;
  documentList: { filename: string; url: string }[];
  startDate: string;
  endDate: string;
  applicationStart: string;
  applicationEnd: string;
  status: string;
  boothList: string[];
  isLocal: boolean;
  isArchived: boolean;
}

export interface EventBusinessMonitor {
  _id: string;
  businessList: BusinessWithViolation[];
  title: string;
  logo: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  boothList: string[];
  isLocal: boolean;
  isArchived: boolean;
}
