export interface EventSaleType {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  businessList: {
    _id: string;
    name: string;
    totalSale: number;
    saleList: {
      _id: string;
      createdAt: Date;
      totalAmount: { $numberDecimal: string };
    }[];
  }[];
}

export interface SaleType {
  _id: string;
  business: string;
  event: string;
  eventTitle?: string;
  transactionList: Transaction[];
  totalAmount: { $numberDecimal: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  date: string;
  paymentMethod: string;
  productList: Product[];
  totalAmount: { $numberDecimal: string };
}

export interface Product {
  name: string;
  quantity: number;
  price: { $numberDecimal: string };
}

export interface SalesRecord {
  eventId: string;
  eventTitle: string;
  sale: {
    _id: string;
    business: string;
    event: string;
    product: Product[];
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
