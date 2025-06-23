"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidationSchema = exports.shippingInfoSchema = void 0;
const zod_1 = require("zod");
const order_interface_1 = require("./order.interface");
exports.shippingInfoSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Full name is required.' })
        .min(2, { message: 'Full name must be at least 2 characters long.' })
        .max(50, { message: 'Full name must be under 50 characters.' }),
    email: zod_1.z
        .string({ required_error: 'Email is required.' })
        .email({ message: 'Please enter a valid email address.' }),
    contact: zod_1.z
        .string({ required_error: 'Contact number is required.' })
        .regex(/^\+?[0-9]{10,15}$/, {
        message: 'Contact number must be valid (10 to 15 digits).',
    }),
    address: zod_1.z.object({
        street: zod_1.z
            .string({ required_error: 'Street address is required.' })
            .min(4, { message: 'Street must be at least 4 characters long.' }),
        city: zod_1.z
            .string({ required_error: 'City is required.' })
            .min(2, { message: 'City must be at least 2 characters long.' }),
        postalCode: zod_1.z
            .string({ required_error: 'Postal code is required.' })
            .min(4, { message: 'Postal code must be at least 4 characters.' }),
        country: zod_1.z
            .string({ required_error: 'Country is required.' })
            .min(2, { message: 'Country must be at least 2 characters long.' }),
    }),
});
const createOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        product: zod_1.z.string({ required_error: 'Product id is required.' }),
        quantity: zod_1.z
            .number({ required_error: 'Quantity is required.' })
            .nonnegative({ message: 'Quantity should be a positive number.' }),
        shippingInfo: exports.shippingInfoSchema,
    }),
});
const changeOrderStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(Object.values(order_interface_1.OrderStatus), {
            message: 'Please Select a status value.',
        }),
    }),
});
exports.orderValidationSchema = {
    createOrderValidationSchema,
    changeOrderStatusValidationSchema,
};
