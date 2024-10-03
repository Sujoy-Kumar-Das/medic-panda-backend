import { Schema, model } from 'mongoose';
import { IPaymentInfo } from './payment.interface';

const PaymentInfoSchema = new Schema<IPaymentInfo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const PaymentModel = model<IPaymentInfo>(
  'paymentInfo',
  PaymentInfoSchema,
);
