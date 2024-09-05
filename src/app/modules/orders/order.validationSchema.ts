import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    product: z.string({ required_error: 'Product id is required.' }),
    quantity: z
      .number({ required_error: 'Quantity is required.' })
      .nonnegative({ message: 'Quantity should be a positive number.' }),
  }),
});

export const orderValidationSchema = { createOrderValidationSchema };
