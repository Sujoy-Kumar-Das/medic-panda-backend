import { Types } from 'mongoose';

export interface IUserPermanentAddress {
  city: string;
  street: string;
  postalCode: string;
  country: string;
}

export interface ICustomer {
  user: Types.ObjectId;
  name: string;
  photo: string;
  contact?: string | null;
  address: IUserPermanentAddress;
}
