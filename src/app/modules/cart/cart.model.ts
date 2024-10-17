import { model, Schema } from 'mongoose';
import { ICart } from './cart.interface';

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
  },
  product: {
    type: Schema.Types.ObjectId,
    required: [true, 'Product is required.'],
    ref: 'product',
  },
  quantity: {
    type: Number,
    default: 1,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

export const cartModel = model<ICart>('cart', cartSchema);
