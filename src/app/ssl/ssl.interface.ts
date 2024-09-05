import { Types } from 'mongoose';

export interface ISSlPayload {
  total: number;
  productName: string;
  productId: Types.ObjectId;
  userEmail: string;
  userAddress: string;
  country: string;
  city: string;
  phone: string;
  transactionId: string;
}
