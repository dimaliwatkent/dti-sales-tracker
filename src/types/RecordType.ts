export interface Record {
  eventId: string;
  eventName: string;
  startDate: Date;
  endDate: Date;
  exhibitorCount: number;
  rejectedCount: number;
  applicantCount: number;
  businessList: RecordBusiness[];
}

export interface RecordBusiness {
  businessId: string;
  businessName: string;
  totalAmount: number;
  targetSales: number;
  dailySales: BusinessSale[];
  category: string;
}

interface BusinessSale {
  saleId: string;
  createdAt: Date;
  totalSales: number;
}
