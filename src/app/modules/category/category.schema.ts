import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Category name is required.',
    }),
    description: z
      .string({
        required_error: 'Category type is required.',
      })
      .min(100, {
        message: 'Category description should be 100 character minimum.',
      }),
    thumbnail: z
      .string({
        required_error: 'Thumbnail is required.',
      })
      .url({
        message: 'Thumbnail must be a valid URL.',
      }),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Category name is required.',
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
  }),
});

export const categoryValidationSchema = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
