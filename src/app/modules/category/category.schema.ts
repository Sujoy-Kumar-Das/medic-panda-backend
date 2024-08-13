import { z } from 'zod';

const createCategorySchema = z.object({
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

export const categorySchema = {
  createCategorySchema,
};
