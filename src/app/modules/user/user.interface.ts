import { Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  role: 'user' | 'admin' | 'super-admin';
  isDeleted?: boolean;
  isBlocked?: boolean;
}

export interface IUserMethods extends Model<IUser> {
  isUserExists(email: string): Promise<IUser | null>;
}
