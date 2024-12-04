export interface CustomProduct {
  _id?: string;
  user: string;
  event: string;
  name: string;
  price: { $numberDecimal: string };
}
