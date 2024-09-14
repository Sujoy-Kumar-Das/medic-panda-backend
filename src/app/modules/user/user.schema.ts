import { z } from 'zod';

const userAddressValidationSchema = z.object({
  city: z.string({ required_error: 'City is required.' }).optional(),
  state: z.string({ required_error: 'State is required.' }).optional(),
  postalCode: z
    .string({ required_error: 'Postal Code is required.' })
    .optional(),
  country: z.string({ required_error: 'Country is required.' }).optional(),
});

const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required.' })
      .min(2, { message: 'Name should be at least 2 characters long.' }),
    photo: z
      .string({ required_error: 'Image is required.' })
      .url({ message: 'Image URL is invalid.' }),
    email: z
      .string({ required_error: 'Email is required.' })
      .email({ message: 'Please enter a valid email.' }),
    password: z
      .string({ required_error: 'Password is required.' })
      .min(8, { message: 'Password should be at least 8 characters long.' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
      .regex(/[@$!%*?&]/, {
        message: 'Password must contain at least one special character.',
      })
      .max(32, {
        message: 'Password should not be longer than 32 characters.',
      }),
  }),
});

const updateUserValidationSchema = z.object({
  body: z
    .object({
      name: z
        .string({ required_error: 'Name is required.' })
        .min(2, { message: 'Name should be at least 2 characters long.' })
        .optional(),
      photo: z
        .string({ required_error: 'Image is required.' })
        .url({ message: 'Image URL is invalid.' })
        .optional(),
      contact: z
        .string({ required_error: 'Contact number is required.' })
        .optional(),
      address: userAddressValidationSchema.optional(),
    })
    .strict(),
});

export const userValidationSchema = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
