import mongoose, { Model, Types } from 'mongoose';


export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superAdmin';
  passwordChangeAt?: Date;
  lastLoginAt?: Date | null;
  isEmailVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  passwordWrongAttempt: number;
  passwordChangeBlockTime: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type TFindUserMethods = (IUser & { _id: Types.ObjectId }) | null;

export interface IUserMethods extends Model<IUser> {
  isUserExists(email: string): Promise<TFindUserMethods>;
  findUserWithID(
    id: string,
    session?: mongoose.ClientSession,
  ): Promise<TFindUserMethods>;
  isJwtIssuedBeforePasswordChange(
    passwordChangeAt: Date,
    jwtIssuedTime: number,
  ): boolean;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
