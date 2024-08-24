import { model, Schema } from 'mongoose';
import { ICustomer } from './customer.interface';

const customerSchema = new Schema<ICustomer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    photo: {
      type: String,
      required: [true, 'Photo is required.'],
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    versionKey: false,
  },
);

export const customerModel = model<ICustomer>('customer', customerSchema);
