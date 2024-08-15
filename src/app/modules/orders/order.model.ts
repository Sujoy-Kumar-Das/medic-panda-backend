import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'User is required.'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: [true, 'Product is required.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const orderMOdel = model<IOrder>('order', orderSchema);
