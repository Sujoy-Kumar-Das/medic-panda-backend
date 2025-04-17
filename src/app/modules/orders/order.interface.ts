import { Types } from 'mongoose';

export enum OrderStatus {
  PAID = 'paid',
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  RETURNED = 'returned',
}

export interface IShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
export interface IShippingInfo {
  name: string;
  email: string;
  contact: string;
  address: IShippingAddress;
}

export interface IOrder {
  user: Types.ObjectId;
  product: Types.ObjectId;
  shippingInfo?: IShippingInfo;
  paymentId: string;
  quantity: number;
  total: number;
  status: OrderStatus;
}
