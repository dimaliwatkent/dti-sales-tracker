export interface ProductType {
  name: string;
  price: { $numberDecimal: string };
  description: string;
  picture: string;
}
