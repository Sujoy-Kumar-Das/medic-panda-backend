export interface IAddress {
  state: string;
  city: string;
  country: string;
  zipCode: number;
}

export interface IManufacturer {
  name: string;
  description: string;
  contact: string;
  address: IAddress;
  isDeleted?: boolean;
}
