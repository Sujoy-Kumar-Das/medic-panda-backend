import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { customerController } from './customer.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userValidationSchema } from '../user/user.schema';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  customerController.getAllCustomerController,
);

router.get(
  '/detail/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  customerController.getSingleCustomerController,
);

router.get(
  '/block',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  customerController.getBlockCustomerController,
);

router.get(
  '/delete',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  customerController.getDeletedCustomerController,
);

router.patch(
  '/block/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  customerController.blockCustomerController,
);

router.delete(
  '/delete/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  customerController.deleteCustomerController,
);

router.patch(
  '/:id',
  validateRequest(userValidationSchema.updateUserValidationSchema),
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  customerController.updateCustomerController,
);

export const customerRoutes = router;
