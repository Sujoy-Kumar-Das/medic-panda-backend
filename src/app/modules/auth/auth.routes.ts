import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { authController } from './auth.controller';
import { authValidationSchema } from './auth.validationSchema';

const router = express.Router();

router.post(
  '/singup',
  validateRequest(authValidationSchema.signup),
  authController.singup,
);

router.post(
  '/verify-otp',
  validateRequest(authValidationSchema.verifyOtp),
  authController.verifyOtp,
);

router.post(
  '/login',
  validateRequest(authValidationSchema.login),
  authController.login,
);

router.post('/logout', auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin), authController.logout);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(authValidationSchema.changePassword),
  authController.changePassword,
);

router.post(
  '/forgot-password',
  validateRequest(authValidationSchema.forgotPassword),
  authController.forgotPassword,
);

router.post(
  '/reset-password',
  validateRequest(authValidationSchema.resetPasswordValidationSchema),
  authController.resetPasswordController,
);

router.post('/refresh-token', authController.refreshToken);

export const authRoutes = router;
