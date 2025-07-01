import mongoose, { CallbackError, model, Schema } from 'mongoose';
import { updateExpiredDiscountsForFetchedProducts } from '../../utils/updateExpiredDiscounts';
import {
  IDiscount,
  IProduct,
  IProductModel,
  IRating,
} from './product.interface';

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
      type: Date,
      required: [true, 'Start date is required.'],
    },
    endDate: {
      type: Date,
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
    _id: false,
    versionKey: false,
  },
);

const ratingSchema = new Schema<IRating>(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { _id: false, versionKey: false, timestamps: true },
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
    default: null,
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
    type: ratingSchema,
    default: { average: 0, count: 0, lastUpdated: new Date() },
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

// Post-query middleware to clean up expired discounts

productSchema.post(['find', 'findOne'], async function (docs, next) {
  try {
    if (!docs) return next();

    await updateExpiredDiscountsForFetchedProducts(docs);

    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

productSchema.post('findOneAndUpdate', async function (doc, next) {
  try {
    if (!doc) return next();
    await updateExpiredDiscountsForFetchedProducts(doc);
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

productSchema.post('aggregate', async function (doc, next) {
  try {
    if (!doc) return next();
    await updateExpiredDiscountsForFetchedProducts(doc);
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

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
