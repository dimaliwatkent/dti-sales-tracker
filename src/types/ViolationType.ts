export interface BusinessWithViolation {
  _id: string;
  name: string;
  logo: string;
  boothNumber: string;
  violationList: BusinessViolation[];
}
export interface BusinessViolation {
  _id: string;
  business: string;
  violation: ViolationType;
  monitor: { name: string };
  message: string;
  imageProof: string;
  count: number;
  isPaid: boolean;
  datePaid: Date;
  violationDate: Date;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViolationType {
  _id?: string;
  name: string;
  fee: number;
  description: string;
}
