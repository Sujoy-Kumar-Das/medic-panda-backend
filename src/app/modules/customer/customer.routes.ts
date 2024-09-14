import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { userValidationSchema } from '../user/user.schema';
import { customerController } from './customer.controller';
const router = express.Router();

router.patch(
  '/customer',
  validateRequest(userValidationSchema.updateUserValidationSchema),
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  customerController.updateCustomerController,
);

export const customerRoutes = router;
