import { Types } from 'mongoose';

export interface IReply {
  user: Types.ObjectId;
  reply: string;
}

export interface IReview {
  product: Types.ObjectId;
  user: Types.ObjectId;
  comment: string;
  rating: number;
  replies?: IReply[];
  createdAt?: Date;
  updatedAt?: Date;
}
