import { Types } from 'mongoose';
import { IUserPermanentAddress } from '../customer/customer.interface';

export interface IAdmin {
  user: Types.ObjectId;
  name: string;
  photo?: string;
  contact: string | null;
  address: IUserPermanentAddress;
  isDeleted: boolean;
  isBlocked: boolean;
}
