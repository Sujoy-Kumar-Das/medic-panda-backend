import { Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELED = 'Canceled',
  RETURNED = 'Returned',
}

export interface IShippingAddress {
  city: string;
  state: string;
  postalCode: number;
  country: string;
}

export interface IOrder {
  user: Types.ObjectId;
  product: Types.ObjectId;
  shippingAddress?: IShippingAddress;
  paymentId: string;
  quantity: number;
  total: number;
  isPaid: boolean;
  isCanceled: boolean;
  isDeleted: boolean;
  status: OrderStatus;
}
