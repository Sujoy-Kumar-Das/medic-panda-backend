"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidationSchema = exports.updateCategoryValidationSchema = exports.createCategoryValidationSchema = void 0;
const zod_1 = require("zod");
exports.createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Category name is required.',
        }),
        icon: zod_1.z.string({
            required_error: 'Icon is required.',
        }),
        thumbnail: zod_1.z
            .string({
            required_error: 'Thumbnail is required.',
        })
            .url({
            message: 'Thumbnail must be a valid URL.',
        }),
        description: zod_1.z
            .string({
            required_error: 'Description is required.',
        })
            .min(50, {
            message: 'Description should be at least 50 characters long.',
        })
            .max(100, { message: 'Description should not exceed 100 characters.' }),
        popularity: zod_1.z.boolean().optional(),
    }),
});
exports.updateCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        thumbnail: zod_1.z
            .string()
            .url({ message: 'Thumbnail must be a valid URL.' })
            .optional(),
        description: zod_1.z
            .string()
            .min(50, {
            message: 'Description should be at least 50 characters long.',
        })
            .max(100, { message: 'Description should not exceed 100 characters.' })
            .optional(),
        popularity: zod_1.z.boolean().optional(),
    }),
});
exports.categoryValidationSchema = {
    createCategoryValidationSchema: exports.createCategoryValidationSchema,
    updateCategoryValidationSchema: exports.updateCategoryValidationSchema,
};
