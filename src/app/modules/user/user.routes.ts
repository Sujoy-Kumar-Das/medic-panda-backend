import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
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
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidationSchema.createUserValidationSchema),
  userController.createAdminController,
);

router.get(
  '/get-me',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.getMeController,
);

export const userRoutes = router;
