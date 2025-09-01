import { z } from 'zod';

export const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Category name is required.',
    }),
    icon: z.string({
      required_error: 'Icon is required.',
    }),
    thumbnail: z
      .string({
        required_error: 'Thumbnail is required.',
      })
      .url({
        message: 'Thumbnail must be a valid URL.',
      }),
    description: z
      .string({
        required_error: 'Description is required.',
      })
      .min(50, {
        message: 'Description should be at least 50 characters long.',
      })
      .max(100, { message: 'Description should not exceed 100 characters.' }),
    popularity: z.boolean().optional(),
  }),
});

export const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    icon: z.string().optional(),
    thumbnail: z
      .string()
      .url({ message: 'Thumbnail must be a valid URL.' })
      .optional(),
    description: z
      .string()
      .min(50, {
        message: 'Description should be at least 50 characters long.',
      })
      .max(100, { message: 'Description should not exceed 100 characters.' })
      .optional(),
    popularity: z.boolean().optional(),
  }),
});

export const categoryValidationSchema = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
