import mongoose, { FilterQuery, Model, Types } from 'mongoose';


export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'superAdmin';
  passwordChangeAt?: Date;
  lastLoginAt?: Date | null;
  isEmailVerified?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  passwordWrongAttempt?: number;
  passwordChangeBlockTime?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type TFindUserResult = (IUser & { _id: Types.ObjectId }) | null;


export interface IUserMethods extends Model<IUser> {

  // find the user with sensitive fields
  findUserWithSensitiveFields(
    query: FilterQuery<IUser>,
    session?: mongoose.ClientSession,
  ): Promise<TFindUserResult>;

  // find the user with sensitive fields, validate and throw error
  findAndValidateUser(
    query: FilterQuery<IUser>,
    session?: mongoose.ClientSession,
  ): Promise<IUser & { _id: Types.ObjectId }>;


  // check the jwt token valid or not after changing password
  isJwtIssuedBeforePasswordChange(
    passwordChangeAt: Date,
    jwtIssuedTime: number,
  ): boolean;

  // check password match or not
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
