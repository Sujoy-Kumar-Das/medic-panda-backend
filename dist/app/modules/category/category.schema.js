"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidationSchema = void 0;
const zod_1 = require("zod");
const createCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Category name is required.',
        }),
        thumbnail: zod_1.z
            .string({
            required_error: 'Thumbnail is required.',
        })
            .url({
            message: 'Thumbnail must be a valid URL.',
        }),
    }),
});
const updateCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Category name is required.',
        })
            .optional(),
        thumbnail: zod_1.z
            .string({
            required_error: 'Thumbnail is required.',
        })
            .url({
            message: 'Thumbnail must be a valid URL.',
        })
            .optional(),
    }),
});
exports.categoryValidationSchema = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};
