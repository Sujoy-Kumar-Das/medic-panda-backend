import { Types } from 'mongoose';

export interface IPaymentInfo {
  user: Types.ObjectId;
  order: Types.ObjectId;
  transactionId: string;
}
