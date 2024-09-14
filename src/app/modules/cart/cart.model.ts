import { model, Schema } from 'mongoose';
import { ICart } from './cart.interface';

const cartSchema = new Schema<ICart>({
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

export const cartModel = model<ICart>('cart', cartSchema);
