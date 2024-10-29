import { model, Schema } from 'mongoose';
import { IOrder, IShippingAddress, OrderStatus } from './order.interface';

export const orderShippingAddressSchema = new Schema<IShippingAddress>(
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
    contact: {
      type: String,
      required: [true, 'Contact number is required.'],
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
    shippingAddress: {
      type: orderShippingAddressSchema,
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
