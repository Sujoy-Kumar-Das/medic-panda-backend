import { Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  role: 'user' | 'admin' | 'super-admin';
  isDeleted?: boolean;
  isBlocked?: boolean;
  passwordChangeAt: Date;
  otpCode: string;
  otpTime: Date;
  isVerified: boolean;
}

export interface IUserMethods extends Model<IUser> {
  isUserExists(email: string): Promise<IUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
