import { z } from 'zod';

const CartValidationSchema = z.object({
  body: z.object({
    product: z.string({ required_error: 'Product id is required.' }),
    quantity: z
      .number({ required_error: 'Quantity is required.' })
      .nonnegative()
      .optional(),
  }),
});

export default CartValidationSchema;
