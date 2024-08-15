import { model, Schema } from 'mongoose';
import { IProductDetail } from './productDetail.interface';

const productDetailSchema = new Schema<IProductDetail>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: [true, 'Category ID is required.'],
  },
  photos: {
    type: [String],
    required: [true, 'Product photos are required.'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required.'],
  },
  metaKey: {
    type: String,
    required: [true, 'Meta key is required.'],
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required.'],
    min: [0, 'Stock quantity cannot be negative.'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

export const productDetailModel = model<IProductDetail>(
  'productDetail',
  productDetailSchema,
);
