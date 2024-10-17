import { z } from 'zod';

const createCartValidationSchema = z.object({
  body: z.object({
    product: z.string({ required_error: 'Product id is required.' }),
    quantity: z
      .number({ required_error: 'Quantity is required.' })
      .nonnegative()
      .optional(),
  }),
});

const updateCartValidationSchema = z.object({
  body: z.object({
    quantity: z
      .number({ required_error: 'Quantity is required.' })
      .nonnegative()
      .optional(),
  }),
});

export const cartValidationSchema = {
  createCartValidationSchema,
  updateCartValidationSchema,
};
