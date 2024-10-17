import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email({ message: 'Please enter a valid email.' }),
    password: z.string({ required_error: 'Password is required.' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required.' }),
    newPassword: z
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

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required.' })
      .email({ message: 'Please enter a valid email.' }),
  }),
});

const resetPasswordValidationSchema = z
  .object({
    body: z.object({
      password: z
        .string({ required_error: 'Old password is required.' })
        .min(8, { message: 'Password should be at least 8 characters long.' })
        .regex(/[A-Z]/, {
          message: 'Password must contain at least one uppercase letter.',
        })
        .regex(/[a-z]/, {
          message: 'Password must contain at least one lowercase letter.',
        })
        .regex(/[0-9]/, {
          message: 'Password must contain at least one number.',
        })
        .regex(/[@$!%*?&]/, {
          message: 'Password must contain at least one special character.',
        })
        .max(32, {
          message: 'Password should not be longer than 32 characters.',
        }),
      newPassword: z
        .string({ required_error: 'New password is required.' })
        .min(8, { message: 'Password should be at least 8 characters long.' })
        .regex(/[A-Z]/, {
          message: 'Password must contain at least one uppercase letter.',
        })
        .regex(/[a-z]/, {
          message: 'Password must contain at least one lowercase letter.',
        })
        .regex(/[0-9]/, {
          message: 'Password must contain at least one number.',
        })
        .regex(/[@$!%*?&]/, {
          message: 'Password must contain at least one special character.',
        })
        .max(32, {
          message: 'Password should not be longer than 32 characters.',
        }),
    }),
  })
  .refine((data) => data.body.password === data.body.newPassword, {
    message: 'New password must be different from the old password.',
    path: ['newPassword'],
  });

export const authValidationSchema = {
  loginValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
