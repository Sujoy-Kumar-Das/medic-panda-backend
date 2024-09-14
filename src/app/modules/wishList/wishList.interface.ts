import { Types } from 'mongoose';

export interface IWishList {
  user: Types.ObjectId;
  product: Types.ObjectId;
  isDeleted?: boolean;
}
