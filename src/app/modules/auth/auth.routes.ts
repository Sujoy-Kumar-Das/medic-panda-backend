import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { authController } from './auth.controller';
import { authValidationSchema } from './auth.validationSchema';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidationSchema.loginValidationSchema),
  authController.loginController,
);

router.post('/logout', authController.logoutController);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  validateRequest(authValidationSchema.changePasswordValidationSchema),
  authController.changePasswordController,
);

router.post(
  '/forgot-password',
  validateRequest(authValidationSchema.forgotPasswordValidationSchema),
  authController.forgotPasswordController,
);

router.post(
  '/reset-password',
  validateRequest(authValidationSchema.resetPasswordValidationSchema),
  authController.resetPasswordController,
);

router.post('/refresh-token', authController.refreshTokenController);

export const authRoutes = router;
