import { Types } from 'mongoose';

export interface IOrder {
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  isPaid: boolean;
  isCanceled: boolean;
  isDeleted: true;
}
