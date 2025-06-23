"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidationSchema = void 0;
const zod_1 = require("zod");
const createReview = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z
            .string({
            required_error: 'Product ID is required',
            invalid_type_error: 'Product ID must be a valid string',
        })
            .min(1, 'Product ID cannot be empty'),
        user: zod_1.z
            .string({
            required_error: 'User ID is required',
            invalid_type_error: 'User ID must be a valid string',
        })
            .min(1, 'User ID cannot be empty'),
        comment: zod_1.z
            .string({
            required_error: 'Comment is required',
            invalid_type_error: 'Comment must be a string',
        })
            .min(3, 'Comment must be at least 3 characters'),
        rating: zod_1.z
            .number({
            required_error: 'Rating is required',
            invalid_type_error: 'Rating must be a number',
        })
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating cannot exceed 5'),
    }),
});
const editReview = zod_1.z.object({
    body: zod_1.z.object({
        comment: zod_1.z
            .string({
            required_error: 'Comment is required',
            invalid_type_error: 'Comment must be a string',
        })
            .min(3, 'Comment must be at least 3 characters'),
        rating: zod_1.z
            .number({
            required_error: 'Rating is required',
            invalid_type_error: 'Rating must be a number',
        })
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating cannot exceed 5'),
    }),
});
exports.reviewValidationSchema = {
    createReview,
    editReview,
};
