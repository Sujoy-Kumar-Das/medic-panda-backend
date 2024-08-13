import { z } from 'zod';

const createVariantValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Variant name is required.' }),
    price: z
      .number({ required_error: 'Variant price is required.' })
      .nonnegative({ message: 'Price must be positive.' }),
  }),
});

const updateVariantValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Variant name is required.' }).optional(),
    price: z
      .number({ required_error: 'Variant price is required.' })
      .nonnegative({ message: 'Price must be positive.' })
      .optional(),
  }),
});

export const variantValidationSchema = {
  createVariantValidationSchema,
  updateVariantValidationSchema,
};
