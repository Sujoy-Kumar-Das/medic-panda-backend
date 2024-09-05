import { model, Schema } from 'mongoose';
import { IUserPermanentAddress, ICustomer } from './customer.interface';

export const addressSchema = new Schema<IUserPermanentAddress>({
  city: {
    type: String,
    required: [true, 'City is required.'],
  },
  country: {
    type: String,
    required: [true, 'Country is required.'],
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required.'],
  },
  state: {
    type: String,
    required: [true, 'State is required.'],
  },
});

const customerSchema = new Schema<ICustomer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    photo: {
      type: String,
      required: [true, 'Photo is required.'],
    },
    contact: {
      type: String,
      default: null,
    },
    address: {
      type: addressSchema,
    },
    isBlocked: {
      type: Boolean,
      default: false,
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
customerSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

customerSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

customerSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

customerSchema.pre('find', function (next) {
  this.find({ isBlocked: { $ne: true } });
  next();
});

customerSchema.pre('findOne', function (next) {
  this.find({ isBlocked: { $ne: true } });
  next();
});

customerSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isBlocked: { $ne: true } } });
  next();
});

export const customerModel = model<ICustomer>('customer', customerSchema);
