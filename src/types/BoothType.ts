export interface BoothType {
  code: string;
  business: string;
}

export interface BusinessBoothType {
  _id: string;
  name: string;
}


export interface EventBoothType {
  _id: string;
  title: string;
  businessList: {
    _id: string;
    name: string;
  }[];
  boothList: BoothType[];
}
