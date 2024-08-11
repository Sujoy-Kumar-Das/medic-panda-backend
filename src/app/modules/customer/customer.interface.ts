import { Types } from 'mongoose';

export interface ICustomer {
  userId: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  photo: string;
}
