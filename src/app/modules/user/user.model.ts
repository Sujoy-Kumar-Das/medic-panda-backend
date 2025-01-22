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
      index: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
      select: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    passwordChangeAt: {
      type: Date,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: Number,
      default: null,
      select: false,
    },
    otpTime: {
      type: Date,
      default: null,
      select: false,
    },
    wrongOTPAttempt: {
      type: Number,
      default: 0,
      select: false,
    },
    resetTime: {
      type: Date,
      default: null,
      select: false,
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

// find user by id
userSchema.statics.findUserWithID = function (id: string) {
  return userModel
    .findById(id)
    .select(
      '+isBlocked +isDeleted +passwordChangeAt +otpCode +otpTime +wrongOTPAttempt +resetTime',
    );
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

export const userModel = model<IUser, IUserMethods>('user', userSchema);
