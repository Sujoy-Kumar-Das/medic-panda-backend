import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: Number,
      default: null,
    },
    otpTime: {
      type: Date,
      default: null,
    },
    wrongOTPAttempt: {
      type: Number,
      default: 0,
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

// is password matched method
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// is jwt issued before password change method
userSchema.statics.isJwtIssuedBeforePasswordChange = function (
  passwordChangeAt: Date,
  jwtIssuedTime: number,
) {
  const passwordChangeTime = new Date(passwordChangeAt).getTime() / 1000;
  return jwtIssuedTime < passwordChangeTime;
};

// hash password middleware
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // hashing password and save into DB
  user.password = await hashPassword(user.password);

  next();
});

// method for remove password and sensitive fields
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.isDeleted;
  delete user.isBlocked;
  delete user.passwordChangeAt;
  delete user.passwordWrongAttempt;
  delete user.resetTime;
  delete user.verifyTime;
  return user;
};

export const userModel = model<IUser, IUserMethods>('user', userSchema);
