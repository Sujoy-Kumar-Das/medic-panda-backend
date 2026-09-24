import { Types } from 'mongoose';

export interface IUserPermanentAddress {
  city: string;
  street: string;
  postalCode: number;
  country: string;
}

export interface ICustomer {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  photoUrl?: string | null;
  dob?: Date | null;
  phone?: string | null;
  address?: Types.ObjectId | null;
  createdAt?: string;
  updatedAt?: string;
}
