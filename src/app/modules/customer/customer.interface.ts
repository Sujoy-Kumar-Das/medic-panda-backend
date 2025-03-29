import { Types } from 'mongoose';

export interface IUserPermanentAddress {
  city: string;
  street: string;
  postalCode: number;
  country: string;
}

export interface ICustomer {
  user: Types.ObjectId;
  name: string;
  photo: string;
  contact?: number | null;
  address: IUserPermanentAddress;
}
