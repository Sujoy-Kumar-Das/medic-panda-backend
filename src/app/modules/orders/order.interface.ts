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
  status: OrderStatus;
}
