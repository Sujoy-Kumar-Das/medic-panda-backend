import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authController } from './auth.controller';
import { authValidationSchema } from './auth.validationSchema';

const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidationSchema.loginValidationSchema),
  authController.loginController,
);

export const authRoutes = router;
