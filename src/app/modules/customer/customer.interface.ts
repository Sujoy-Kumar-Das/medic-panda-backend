import { Types } from 'mongoose';

export interface ICustomer {
  user: Types.ObjectId;
  name: string;
  photo: string;
  contact?: string | null;
  isDeleted: boolean;
  isBlocked: boolean;
}
