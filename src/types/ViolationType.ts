export interface BusinessViolation {
  _id: string;
  business: string;
  violation: Violation;
  monitor: string;
  imageProof: string;
  count: number;
  isPaid: boolean;
  datePaid: Date;
  violationDate: Date;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Violation {
  name: string;
  fee: number;
  description: string;
}
