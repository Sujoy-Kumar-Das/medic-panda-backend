import { model, Schema } from 'mongoose';
import { IVariant } from './variants.interface';

const variantSchema = new Schema<IVariant>(
  {
    name: {
      type: String,
      required: [true, 'Variant name is required.'],
    },
    price: {
      type: Number,
      required: [true, 'Variant price is required.'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  },
);

// Query Middleware
variantSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

variantSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

variantSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const variantModel = model<IVariant>('variant', variantSchema);
