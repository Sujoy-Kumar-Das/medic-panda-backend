import { Types } from 'mongoose';

export interface IPaymentInfo {
  user: Types.ObjectId;
  transactionId: string;
}
