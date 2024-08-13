import { model, Schema } from 'mongoose';
import { IProduct, IProductModel } from './product.interface';

const productSchema = new Schema<IProduct, IProductModel>({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required.'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Product thumbnail is required.'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required.'],
  },
  discountPrice: {
    type: Number,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  stockStatus: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Query Middleware
productSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

productSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

productSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// product statics methods

productSchema.statics.isProductExistsByName = async function (name: string) {
  return await productModel.findOne({
    name: {
      $regex: name,
      $options: 'i',
    },
  });
};

productSchema.statics.isProductExistsById = async function (id: string) {
  return await productModel.findById(id);
};

export const productModel = model<IProduct, IProductModel>(
  'product',
  productSchema,
);
