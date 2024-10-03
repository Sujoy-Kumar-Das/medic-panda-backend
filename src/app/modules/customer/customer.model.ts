import { model, Schema } from 'mongoose';
import { ICustomer, IUserPermanentAddress } from './customer.interface';

export const addressSchema = new Schema<IUserPermanentAddress>(
  {
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
    street: {
      type: String,
      required: [true, 'Street is required.'],
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

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
  },
  {
    versionKey: false,
  },
);

export const customerModel = model<ICustomer>('customer', customerSchema);
