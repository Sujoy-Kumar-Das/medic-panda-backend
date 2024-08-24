import { z } from 'zod';

const addressSchema = z.object({
  city: z.string({ required_error: 'City is required.' }),
  zipCode: z.number({ required_error: 'Zip code is required.' }),
  state: z.string({ required_error: 'State is required.' }),
  country: z.string({ required_error: 'Country is required.' }),
});

const createManufacturerValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Manufacturer name is required.' })
      .min(3, {
        message: 'Manufacturer name must be at least 3 characters long.',
      }),
    description: z
      .string({
        required_error: 'Manufacturer description is required.',
      })
      .min(50, {
        message:
          'Manufacturer description must be at least 50 characters long.',
      }),
    contact: z.string({ required_error: 'Manufacturer contact is required.' }),
    address: addressSchema,
  }),
});

export const manufacturerValidationSchema = {
  createManufacturerValidationSchema,
};
