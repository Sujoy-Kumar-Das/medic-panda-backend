import { z } from 'zod';

const createReview = z.object({
  body: z.object({
    product: z
      .string({
        required_error: 'Product ID is required',
        invalid_type_error: 'Product ID must be a valid string',
      })
      .min(1, 'Product ID cannot be empty'),

    user: z
      .string({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID must be a valid string',
      })
      .min(1, 'User ID cannot be empty'),

    comment: z
      .string({
        required_error: 'Comment is required',
        invalid_type_error: 'Comment must be a string',
      })
      .min(3, 'Comment must be at least 3 characters'),

    rating: z
      .number({
        required_error: 'Rating is required',
        invalid_type_error: 'Rating must be a number',
      })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5'),
  }),
});

const editReview = z.object({
  body: z.object({
    comment: z
      .string({
        required_error: 'Comment is required',
        invalid_type_error: 'Comment must be a string',
      })
      .min(3, 'Comment must be at least 3 characters'),

    rating: z
      .number({
        required_error: 'Rating is required',
        invalid_type_error: 'Rating must be a number',
      })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5'),
  }),
});

export const reviewValidationSchema = {
  createReview,
  editReview,
};
