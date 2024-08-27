import { Types } from 'mongoose';

export interface IAdmin {
  user: Types.ObjectId;
  name: string;
  photo: string;
  contact: string | null;
  isDeleted: boolean;
  isBlocked: boolean;
}
