import { Business, BusinessWithViolation } from "./BusinessType";
/**
 * Interface for event data
 */

export interface Event {
  _id: string;
  businessList: Business[];
  applicantList: Business[];
  title: string;
  logo: string;
  location: string;
  documentList: string[];
  startDate: string;
  endDate: string;
  applicationStart: string;
  applicationEnd: string;
  status: string;
  booth: string[];
  isArchived: boolean;
}

export interface EventBusiness {
  _id: string;
  businessList: Business[];
  applicantList: Business[];
  business: Business;
  title: string;
  logo: string;
  location: string;
  documentList: string[];
  startDate: string;
  endDate: string;
  applicationStart: string;
  applicationEnd: string;
  status: string;
  booth: string[];
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
  booth: string[];
  isArchived: boolean;
}
