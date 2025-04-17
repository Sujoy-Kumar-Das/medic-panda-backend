import { model, Schema } from 'mongoose';
import {
  IOrder,
  IShippingAddress,
  IShippingInfo,
  OrderStatus,
} from './order.interface';
const orderShippingAddressSchema = new Schema<IShippingAddress>(
  {
    city: {
      type: String,
      required: [true, 'City is required.'],
    },
    country: {
      type: String,
      required: [true, 'Country is required.'],
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required.'],
    },
    street: {
      type: String,
      required: [true, 'Street is required.'],
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const orderShippingInfoSchema = new Schema<IShippingInfo>(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email.'],
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required.'],
      trim: true,
    },
    address: {
      type: orderShippingAddressSchema,
      required: true,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: [true, 'Product is required.'],
    },
    paymentId: {
      type: String,
    },
    shippingInfo: {
      type: orderShippingInfoSchema,
      required: [true, 'Shipping address is required.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

export const orderModel = model<IOrder>('Order', orderSchema);
