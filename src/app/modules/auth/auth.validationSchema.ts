import { z } from 'zod';

const signup = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required.",
        invalid_type_error: "Name must be a text value.",
      })
      .trim()
      .min(2, "Name must be at least 2 characters long.")
      .max(100, "Name cannot exceed 100 characters."),

    email: z
      .string({
        required_error: "Email is required.",
        invalid_type_error: "Email must be a text value.",
      })
      .trim()
      .email("Please provide a valid email address."),

    password: z
      .string({
        required_error: "Password is required.",
        invalid_type_error: "Password must be a text value.",
      })
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/\d/, "Password must contain at least one number.")
      .regex(/[@$!%*?&#^()_\-+=]/, "Password must contain at least one special character."),
  }),
});

const verifyOtp = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required.",
        invalid_type_error: "Email must be a text value.",
      })
      .trim()
      .email("Please provide a valid email address."),

    otp: z
      .string({
        required_error: "OTP is required.",
        invalid_type_error: "OTP must be a text value.",
      })
      .trim()
      .length(6, "OTP must be exactly 6 digits.")
      .regex(/^\d{6}$/, "OTP must contain only numbers."),
  }),
});

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

const passwordSchema = z
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

const resetPasswordBodySchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password Do Not Match.',
    path: ['confirmPassword'],
  });

const resetPasswordValidationSchema = z.object({
  body: resetPasswordBodySchema,
});

export const authValidationSchema = {
  signup,
  verifyOtp,
  loginValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
