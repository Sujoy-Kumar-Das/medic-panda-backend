import { model, Schema } from 'mongoose';
import { IAdmin } from './admin.interface';

const adminSchema = new Schema<IAdmin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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

export const adminModel = model<IAdmin>('admin', adminSchema);
