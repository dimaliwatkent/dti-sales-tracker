export interface CustomProduct {
  _id: string;
  user: string;
  name: string;
  price: { $numberDecimal: string };
}
