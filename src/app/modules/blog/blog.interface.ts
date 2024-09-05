import { Types } from 'mongoose';

export interface IComment {
  commenter: Types.ObjectId;
  comment: string;
}

export interface IBlog {
  name: string;
  description: string;
  thumbnail: string;
  author: Types.ObjectId;
  comments?: IComment[];
}
