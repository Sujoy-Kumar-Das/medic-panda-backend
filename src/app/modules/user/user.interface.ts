import { Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superAdmin';
  isDeleted?: boolean;
  isBlocked?: boolean;
  passwordChangeAt: Date;
  passwordWrongAttempt: number;
  isVerified: boolean;
}

export interface IUserMethods extends Model<IUser> {
  isUserExists(email: string): Promise<IUser | null>;
  isJwtIssuedBeforePasswordChange(
    passwordChangeAt: Date,
    jwtIssuedTime: number,
  ): boolean;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
