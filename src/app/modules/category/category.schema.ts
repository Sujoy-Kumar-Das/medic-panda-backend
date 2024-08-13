import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Category name is required.',
    }),
    slug: z.string({
      required_error: 'Slug is required.',
    }),
    categoryType: z.enum(['primary', 'secondary', 'tertiary'], {
      required_error: 'Category type is required.',
    }),
    thumbnail: z
      .string({
        required_error: 'Thumbnail is required.',
      })
      .url({
        message: 'Thumbnail must be a valid URL.',
      }),
    variantId: z.string({ required_error: 'Variant is required.' }),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Category name is required.',
      })
      .optional(),
    slug: z
      .string({
        required_error: 'Slug is required.',
      })
      .optional(),
    categoryType: z
      .enum(['primary', 'secondary', 'tertiary'], {
        required_error: 'Category type is required.',
      })
      .optional(),
    thumbnail: z
      .string({
        required_error: 'Thumbnail is required.',
      })
      .url({
        message: 'Thumbnail must be a valid URL.',
      })
      .optional(),
    variantId: z.string({ required_error: 'Variant is required.' }).optional(),
  }),
});

export const categoryValidationSchema = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
