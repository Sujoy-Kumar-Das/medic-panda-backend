import { Types } from 'mongoose';

export interface IReply {
  user: Types.ObjectId;
  review: Types.ObjectId;
  comment: string;
}
