import { Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  RETURNED = 'returned',
}

export interface IShippingAddress {
  city: string;
  street: string;
  postalCode: string;
  country: string;
  contact: string;
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
