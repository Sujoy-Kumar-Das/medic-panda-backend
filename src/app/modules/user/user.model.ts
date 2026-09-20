import bcrypt from 'bcrypt';
import mongoose, { model, Schema } from 'mongoose';
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
      required: [false, 'Password is required.'],
      validate: {
        validator: function (value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      },
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

// find users via email
userSchema.statics.isUserExists = function (email: string) {
  return USER
    .findOne({ email })
    .select(
      '+passwordWrongAttempt +passwordChangeBlockTime +isDeleted +passwordChangeAt +lastLoginAt',
    );
};

// find user by id
userSchema.statics.findUserWithID = function (
  id: string,
  session?: mongoose.ClientSession,
) {
  return USER
    .findById(id)
    .select(
      '+passwordWrongAttempt +passwordChangeBlockTime +isDeleted +passwordChangeAt +lastLoginAt',
    )
    .session(session || null);
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

export const USER = model<IUser, IUserMethods>('user', userSchema);
