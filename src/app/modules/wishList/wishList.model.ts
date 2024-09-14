import { model, Schema } from 'mongoose';
import { IWishList } from './wishList.interface';

const wishListSchema = new Schema<IWishList>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User is required.'],
  },
  product: {
    type: Schema.Types.ObjectId,
    required: [true, 'Product is required.'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const wishListModel = model<IWishList>('wishList', wishListSchema);
