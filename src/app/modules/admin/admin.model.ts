import { model, Schema } from 'mongoose';
import { addressSchema } from '../customer/customer.model';
import { IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin>(
  {
    user: {
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
    contact: {
      type: String,
      default: null,
    },
    address: {
      type: addressSchema,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  },
);

export const adminModel = model<IAdmin>('admin', adminSchema);
