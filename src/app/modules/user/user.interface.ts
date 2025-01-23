import { Model, Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superAdmin';
  isDeleted?: boolean;
  isBlocked?: boolean;
  passwordChangeAt: Date;
  passwordWrongAttempt: number;
  isVerified: boolean;
  otpCode: number | null;
  otpTime: Date | null;
  wrongOTPAttempt: number;
  resetTime: null | Date;
}

type TFindUserMethods = (IUser & { _id: Types.ObjectId }) | null;

export interface IUserMethods extends Model<IUser> {
  isUserExists(email: string): Promise<TFindUserMethods>;
  findUserWithID(id: string): Promise<TFindUserMethods>;
  isJwtIssuedBeforePasswordChange(
    passwordChangeAt: Date,
    jwtIssuedTime: number,
  ): boolean;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
