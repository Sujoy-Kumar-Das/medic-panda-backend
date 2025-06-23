"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidationSchema = exports.discountValidationSchema = void 0;
const zod_1 = require("zod");
const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeOnlyRegex = /^([0-1]\d|2[0-3]):[0-5]\d$/;
exports.discountValidationSchema = zod_1.z.object({
    percentage: zod_1.z
        .number({ required_error: 'Product discount percentage is required.' })
        .min(0, { message: 'Product discount percentage must be at least 0.' })
        .max(100, { message: 'Product discount percentage must be at most 100.' }),
    startDate: zod_1.z
        .string({ required_error: 'Discount start date is required.' })
        .regex(dateOnlyRegex, {
        message: 'Start date must be in YYYY-MM-DD format.',
    }),
    endDate: zod_1.z
        .string({ required_error: 'Discount end date is required.' })
        .regex(dateOnlyRegex, {
        message: 'End date must be in YYYY-MM-DD format.',
    }),
    startTime: zod_1.z
        .string({ required_error: 'Discount start time is required.' })
        .regex(timeOnlyRegex, { message: 'Start time must be in HH:mm format.' }),
    endTime: zod_1.z
        .string({ required_error: 'Discount end time is required.' })
        .regex(timeOnlyRegex, { message: 'End time must be in HH:mm format.' }),
});
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.object({
            name: zod_1.z.string({ required_error: 'Product name is required.' }).min(3, {
                message: 'Product name should be at least 3 characters long.',
            }),
            thumbnail: zod_1.z
                .string({ required_error: 'Product thumbnail is required.' })
                .url({ message: 'Product thumbnail must be a valid URL.' }),
            category: zod_1.z.string({ required_error: 'Category id is required.' }),
            manufacturer: zod_1.z.string({ required_error: 'Manufacture id is required.' }),
            price: zod_1.z
                .number({ required_error: 'Product price is required.' })
                .positive({ message: 'Product price must be a positive number.' }),
            discount: exports.discountValidationSchema.optional(),
        }),
        productDetail: zod_1.z.object({
            description: zod_1.z
                .string({ required_error: 'Description is required.' })
                .min(100, {
                message: 'Description should be minimum 100 characters long.',
            }),
            stock: zod_1.z
                .number({ required_error: 'Stock is required.' })
                .nonnegative({ message: 'Stock should be positive.' }),
            images: zod_1.z
                .array(zod_1.z
                .string({ required_error: 'Photo is required.' })
                .url({ message: 'Each photo must be a valid URL.' }))
                .optional(),
        }),
    }),
});
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.object({
            name: zod_1.z
                .string({ required_error: 'Product name is required.' })
                .min(3, {
                message: 'Product name should be at least 3 characters long.',
            })
                .optional(),
            price: zod_1.z
                .number({ required_error: 'Product price is required.' })
                .positive({ message: 'Product price must be a positive number.' })
                .optional(),
            discountPercentage: zod_1.z
                .number({ required_error: 'Product discount percentage is required.' })
                .min(0, { message: 'Product discount percentage must be at least 0.' })
                .max(100, {
                message: 'Product discount percentage must be at most 100.',
            })
                .optional(),
        }),
        productDetail: zod_1.z.object({
            category: zod_1.z
                .string({ required_error: 'Category id is required.' })
                .optional(),
            manufacture: zod_1.z
                .string({ required_error: 'Manufacture id is required.' })
                .optional(),
            description: zod_1.z
                .string({ required_error: 'Description is required.' })
                .min(100, {
                message: 'Description should be minimum 100 characters long.',
            })
                .optional(),
            stock: zod_1.z
                .number({ required_error: 'Stock is required.' })
                .nonnegative({ message: 'Stock should be positive.' })
                .optional(),
        }),
    }),
});
exports.productValidationSchema = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
