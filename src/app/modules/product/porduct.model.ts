import mongoose, { model, Schema } from 'mongoose';
import { IDiscount, IProduct, IProductModel } from './product.interface';

const discountSchema = new Schema<IDiscount>(
  {
    discountStatus: {
      type: Boolean,
      default: false,
    },
    percentage: {
      type: Number,
      required: [true, 'Discount percentage is required.'],
    },
    discountPrice: {
      type: Number,
      required: false,
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required.'],
    },
    endDate: {
      type: String,
      required: [true, 'End date is required.'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required.'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required.'],
    },
  },
  {
    id: false,
    versionKey: false,
  },
);

const productSchema = new Schema<IProduct, IProductModel>({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Product thumbnail is required.'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required.'],
  },
  discount: {
    type: discountSchema,
    required: false,
    default: undefined,
  },
  stockStatus: {
    type: Boolean,
    default: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: [true, 'Category is required.'],
    ref: 'category',
  },
  manufacturer: {
    type: Schema.Types.ObjectId,
    required: [true, 'Manufacturer is required.'],
    ref: 'manufacturer',
  },
  rating: {
    type: Number,
    default: 0,
  },
  isWishList: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false,
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
  return await productModel
    .findOne({
      name: {
        $regex: name,
        $options: 'i',
      },
    })
    .select('+isDeleted');
};

productSchema.statics.isProductExistsById = async function (
  id: string,
  session: mongoose.ClientSession,
) {
  return await productModel
    .findById(id)
    .select('+isDeleted')
    .session(session || null);
};

// method for remove sensitive fields
productSchema.methods.toJSON = function () {
  const product = this.toObject();
  delete product.isDeleted;

  return product;
};

export const productModel = model<IProduct, IProductModel>(
  'product',
  productSchema,
);
