import { Schema, model } from 'mongoose';
import { IPaymentInfo } from './payment.interface';

const PaymentInfoSchema = new Schema<IPaymentInfo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
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
