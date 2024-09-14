import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import AppError from '../../errors/AppError';
import hashPassword from '../../utils/hashPassword';
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
    passwordChangeAt: {
      type: Date,
    },
    otpCode: {
      type: String,
    },
    otpTime: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

// is user exists statics
userSchema.statics.isUserExists = function (email: string) {
  return userModel.findOne({ email });
};

// is user exists statics
userSchema.statics.isValidUser = async function (
  id: string | Schema.Types.ObjectId,
) {
  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  if (user.isBlocked) {
    throw new AppError(403, 'This user is blocked');
  }

  if (user.isDeleted) {
    throw new AppError(403, 'This user is not found.');
  }

  return user;
};

// is password matched method
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// hash password middleware
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // hashing password and save into DB
  user.password = await hashPassword(user.password);

  next();
});

// Query Middleware
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const userModel = model<IUser, IUserMethods>('user', userSchema);
