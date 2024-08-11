import { model, Schema } from 'mongoose';
import { IUser, IUserMethods } from './user.interface';

const userSchema = new Schema<IUser, IUserMethods>(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
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

userSchema.statics.isUserExists = function (email: string) {
  return userModel.findOne({ email });
};

export const userModel = model<IUser, IUserMethods>('user', userSchema);
