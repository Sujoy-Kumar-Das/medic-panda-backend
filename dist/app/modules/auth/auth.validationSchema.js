"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidationSchema = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'Email is required.' })
            .email({ message: 'Please enter a valid email.' }),
        password: zod_1.z.string({ required_error: 'Password is required.' }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({ required_error: 'Old password is required.' }),
        newPassword: zod_1.z
            .string({ required_error: 'New password is required.' })
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
const forgotPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'Email is required.' })
            .email({ message: 'Please enter a valid email.' }),
    }),
});
const passwordSchema = zod_1.z
    .string({ required_error: 'Password is required.' })
    .min(8, { message: 'Password should be at least 8 characters long.' })
    .max(32, { message: 'Password should not be longer than 32 characters.' })
    .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.',
})
    .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter.',
})
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[@$!%*?&]/, {
    message: 'Password must contain at least one special character.',
});
const resetPasswordBodySchema = zod_1.z
    .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Password Do Not Match.',
    path: ['confirmPassword'],
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: resetPasswordBodySchema,
});
exports.authValidationSchema = {
    loginValidationSchema,
    changePasswordValidationSchema,
    forgotPasswordValidationSchema,
    resetPasswordValidationSchema,
};
