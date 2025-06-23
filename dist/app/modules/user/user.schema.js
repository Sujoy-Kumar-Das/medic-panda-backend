"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = void 0;
const zod_1 = require("zod");
const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
const userAddressValidationSchema = zod_1.z.object({
    city: zod_1.z.string({ required_error: 'City is required.' }).optional(),
    street: zod_1.z.string({ required_error: 'State is required.' }).optional(),
    postalCode: zod_1.z
        .number({ required_error: 'Postal Code is required.' })
        .optional(),
    country: zod_1.z.string({ required_error: 'Country is required.' }).optional(),
});
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required.' })
            .min(2, { message: 'Name should be at least 2 characters long.' }),
        photo: zod_1.z
            .string({ required_error: 'Image is required.' })
            .url({ message: 'Image URL is invalid.' }),
        email: zod_1.z
            .string({ required_error: 'Email is required.' })
            .email({ message: 'Please enter a valid email.' }),
        password: zod_1.z
            .string({ required_error: 'Password is required.' })
            .min(8, { message: 'Password should be at least 8 characters long.' })
            .regex(/[A-Z]/, {
            message: 'Password must contain at least one uppercase letter.',
        })
            .regex(/[a-z]/, {
            message: 'Password must contain at least one lowercase letter.',
        })
            .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
            .regex(/[@$!%*?&]/, {
            message: 'Password must contain at least one special character.',
        })
            .max(32, {
            message: 'Password should not be longer than 32 characters.',
        }),
    }),
});
const createAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'Email is required.' })
            .email({ message: 'Please provide a valid email.' }),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z
            .string({ required_error: 'Name is required.' })
            .min(2, { message: 'Name should be at least 2 characters long.' })
            .optional(),
        photo: zod_1.z
            .string({ required_error: 'Image is required.' })
            .url({ message: 'Image URL is invalid.' })
            .optional(),
        contact: zod_1.z
            .string({ required_error: 'Contact number is required.' })
            .regex(phoneRegex, { message: 'Contact number is invalid.' })
            .optional(),
        address: userAddressValidationSchema.optional(),
    })
        .strict(),
});
const updateUserEmailValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'User email is required.' })
            .email({ message: 'Please provide a valid email.' }),
    }),
});
const blockUserSchema = zod_1.z.object({
    body: zod_1.z.object({ id: zod_1.z.string({ required_error: 'User ID is required.' }) }),
});
const deleteUserSchema = zod_1.z.object({
    body: zod_1.z.object({ id: zod_1.z.string({ required_error: 'User ID is required.' }) }),
});
exports.userValidationSchema = {
    createUserValidationSchema,
    createAdminValidationSchema,
    updateUserValidationSchema,
    updateUserEmailValidationSchema,
    blockUserSchema,
    deleteUserSchema,
};
