import mongoose, { Schema } from 'mongoose';
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
      type: Number,
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
      ref: "User",
      required: [true, "Customer must be linked to a user."],
      unique: true,
    },

    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [100, "Name cannot exceed 100 characters."],
    },

    photoUrl: {
      type: String,
      default: null,
      validate: {
        validator: (value: string | null) =>
          value === null || /^https:\/\/res\.cloudinary\.com\/.+/.test(value),
        message: "Photo URL must be a valid Cloudinary URL.",
      },
    },

    dob: {
      type: Date,
      default: null,
      validate: {
        validator: (value: Date | null) => value === null || value < new Date(),
        message: "Date of birth cannot be in the future.",
      },
    },

    phone: {
      type: String,
      default: null,
      trim: true,
      validate: {
        validator: (value: string | null) =>
          value === null || /^\+?[1-9]\d{7,14}$/.test(value),
        message: "Phone number must be a valid international format (e.g. +8801XXXXXXXXX).",
      },
    },

    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const CUSTOMER = mongoose.model<ICustomer>("Customer", customerSchema);
