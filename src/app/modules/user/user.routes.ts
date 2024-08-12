import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controller';
import { userValidationSchema } from './user.schema';
const router = express.Router();

router.post(
  '/customer',
  validateRequest(userValidationSchema.createUserValidationSchema),
  userController.createCustomerController,
);
router.post(
  '/admin',
  validateRequest(userValidationSchema.createUserValidationSchema),
  userController.createAdminController,
);

export const userRoutes = router;
