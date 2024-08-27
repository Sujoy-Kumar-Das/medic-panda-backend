import { model, Schema } from 'mongoose';
import { IProductDetail } from './productDetail.interface';

const productDetailSchema = new Schema<IProductDetail>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: [true, 'Category ID is required.'],
  },
  manufacture: {
    type: Schema.Types.ObjectId,
    ref: 'manufacture',
    required: [true, 'Manufactured id is required'],
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
