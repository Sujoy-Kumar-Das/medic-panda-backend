import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../config';
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

// is user exists statics
userSchema.statics.isUserExists = function (email: string) {
  return userModel.findOne({ email });
};

// hash password middleware
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // hashing password and save into DB
  user.password = await bcrypt.hash(user.password, Number(config.salt_round));

  next();
});

export const userModel = model<IUser, IUserMethods>('user', userSchema);
