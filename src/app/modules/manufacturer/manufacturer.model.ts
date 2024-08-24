import { model, Schema } from 'mongoose';
import { IAddress, IManufacturer } from './manufacturer.interface';

const addressSchema = new Schema<IAddress>({
  country: {
    type: String,
    required: [true, 'Country is required.'],
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
  },
  state: {
    type: String,
    required: [true, 'State is required.'],
  },
  zipCode: {
    type: Number,
    required: [true, 'Zip code is required.'],
  },
});

const manufacturerSchema = new Schema<IManufacturer>(
  {
    name: {
      type: String,
      required: [true, 'Manufacturer name is required.'],
    },
    description: {
      type: String,
      required: [true, 'Manufacturer description is required.'],
    },
    contact: {
      type: String,
      required: [true, 'manufacturer Contact number is required.'],
    },
    address: {
      type: addressSchema,
      required: [true, 'Address is required.'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Query Middleware
manufacturerSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

manufacturerSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

manufacturerSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const manufacturerModel = model<IManufacturer>(
  'manufacturer',
  manufacturerSchema,
);
