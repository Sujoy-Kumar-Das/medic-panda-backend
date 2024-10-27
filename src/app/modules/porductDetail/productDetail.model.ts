import { model, Schema } from 'mongoose';
import { IProductDetail } from './productDetail.interface';

const productDetailSchema = new Schema<IProductDetail>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
  },
  variant: {
    type: Schema.Types.ObjectId,
    required: [true, 'Variant is required.'],
    ref: 'variant',
  },
  images: {
    type: [String],
  },
  description: {
    type: String,
    required: [true, 'Product description is required.'],
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
