import { model, Schema } from 'mongoose';
import { IOrder, OrderStatus } from './order.interface';

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
    isPaid: {
      type: Boolean,
      default: false,
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const orderModel = model<IOrder>('Order', orderSchema);
