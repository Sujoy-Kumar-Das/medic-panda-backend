import bcrypt from 'bcrypt';
import mongoose, { FilterQuery, model, Schema } from 'mongoose';
import AppError from '../../errors/AppError';
import hashPassword from '../../utils/hashPassword';
import { IUser, IUserMethods } from './user.interface';

// users sensitive fileds

const SENSITIVE_FIELDS =
  '+passwordWrongAttempt +passwordChangeBlockTime +isDeleted +passwordChangeAt +lastLoginAt' as const;

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
      required: [false, 'Password is required.'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superAdmin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordWrongAttempt: {
      type: Number,
      default: 0,
      select: false
    },
    passwordChangeBlockTime: {
      type: Date,
      default: null,
      select: false
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
    passwordChangeAt: {
      type: Date,
      default: null,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }

  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// using virtuals for link customer to user
// userSchema.virtual('customer', {
//   ref: 'customer',
//   localField: '_id',
//   foreignField: 'user',
//   justOne: true,
// });


userSchema.statics.findUserWithSensitiveFields = function (
  query: FilterQuery<IUser>,
  session?: mongoose.ClientSession,
) {
  return this.findOne(query)
    .select(SENSITIVE_FIELDS)
    .session(session || null);
};

userSchema.statics.findAndValidateUser = async function (
  query: FilterQuery<IUser>,
  session?: mongoose.ClientSession,
) {
  const user = await this.findUserWithSensitiveFields(query, session);

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  if (user.isDeleted) {
    throw new AppError(410, 'This user has been deleted.');
  }

  if (!user.isActive) {
    throw new AppError(403, 'This user is not active.');
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

// is jwt issued before password change method
userSchema.statics.isJwtIssuedBeforePasswordChange = function (
  passwordChangeAt: Date,
  jwtIssuedTime: number,
) {
  const passwordChangeTime = new Date(passwordChangeAt).getTime() / 1000;
  return jwtIssuedTime < passwordChangeTime;
};

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

// hash password middleware
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  // Already hashed (e.g. came from the Redis pending-signup flow,
  // where it was hashed before being stored) — don't hash it again.
  if (BCRYPT_HASH_PATTERN.test(user.password)) {
    return next();
  }

  // A genuinely plain-text password (normal signup without the OTP
  // flow, password reset, admin-created account, etc.) — hash it.
  user.password = await hashPassword(user.password);
  next();
});

export const USER = model<IUser, IUserMethods>('user', userSchema);
