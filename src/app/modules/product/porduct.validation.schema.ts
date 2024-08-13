import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    product: z.object({
      name: z.string({ required_error: 'Product name is required.' }).min(3, {
        message: 'Product name should be at least 3 characters long.',
      }),
      slug: z.string({ required_error: 'Product slug is required.' }).min(3, {
        message: 'Product slug should be at least 3 characters long.',
      }),
      thumbnail: z
        .string({ required_error: 'Product thumbnail is required.' })
        .url({ message: 'Product thumbnail must be a valid URL.' }),
      price: z
        .number({ required_error: 'Product price is required.' })
        .positive({ message: 'Product price must be a positive number.' }),
      discountPercentage: z
        .number({ required_error: 'Product discount percentage is required.' })
        .min(0, { message: 'Product discount percentage must be at least 0.' })
        .max(100, {
          message: 'Product discount percentage must be at most 100.',
        }),
    }),
    productDetail: z.object({
      categoryId: z.string({ required_error: 'Category id is required.' }),
      description: z
        .string({ required_error: 'Description is required.' })
        .min(30, {
          message: 'Description should be minimum 30 characters long.',
        }),
      metaKey: z.string({ required_error: 'Meta key is required.' }),
      stock: z
        .number({ required_error: 'Stock is required.' })
        .nonnegative({ message: 'Stock should be positive.' }),
      photos: z.array(
        z
          .string({ required_error: 'Photo is required.' })
          .url({ message: 'Each photo must be a valid URL.' }),
      ),
    }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    product: z.object({
      name: z
        .string({ required_error: 'Product name is required.' })
        .min(3, {
          message: 'Product name should be at least 3 characters long.',
        })
        .optional(),
      slug: z
        .string({ required_error: 'Product slug is required.' })
        .min(3, {
          message: 'Product slug should be at least 3 characters long.',
        })
        .optional(),
      thumbnail: z
        .string({ required_error: 'Product thumbnail is required.' })
        .url({ message: 'Product thumbnail must be a valid URL.' })
        .optional(),
      price: z
        .number({ required_error: 'Product price is required.' })
        .positive({ message: 'Product price must be a positive number.' })
        .optional(),
      discountPercentage: z
        .number({ required_error: 'Product discount percentage is required.' })
        .min(0, { message: 'Product discount percentage must be at least 0.' })
        .max(100, {
          message: 'Product discount percentage must be at most 100.',
        })
        .optional(),
    }),
    productDetail: z.object({
      categoryId: z
        .string({ required_error: 'Category id is required.' })
        .optional(),
      description: z
        .string({ required_error: 'Description is required.' })
        .min(30, {
          message: 'Description should be minimum 30 characters long.',
        })
        .optional(),
      metaKey: z.string({ required_error: 'Meta key is required.' }).optional(),
      stock: z
        .number({ required_error: 'Stock is required.' })
        .nonnegative({ message: 'Stock should be positive.' })
        .optional(),
      photos: z
        .array(
          z
            .string({ required_error: 'Photo is required.' })
            .url({ message: 'Each photo must be a valid URL.' }),
        )
        .optional(),
    }),
  }),
});

export const productValidationSchema = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
