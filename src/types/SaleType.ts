import { Business } from "./BusinessType";

export interface Sale {
  _id: string;
  business: Business;
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
