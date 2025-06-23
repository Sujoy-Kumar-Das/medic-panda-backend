"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartValidationSchema = void 0;
const zod_1 = require("zod");
const createCartValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.string({ required_error: 'Product id is required.' }),
        quantity: zod_1.z
            .number({ required_error: 'Quantity is required.' })
            .nonnegative()
            .optional(),
    }),
});
const updateCartValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z
            .number({ required_error: 'Quantity is required.' })
            .nonnegative()
            .optional(),
    }),
});
exports.cartValidationSchema = {
    createCartValidationSchema,
    updateCartValidationSchema,
};
