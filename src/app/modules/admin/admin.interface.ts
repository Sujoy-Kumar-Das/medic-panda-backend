import { Types } from 'mongoose';

export interface IAdmin {
  userId: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  photo: string;
}
