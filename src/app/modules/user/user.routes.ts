import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { userController } from './user.controller';
import { userValidationSchema } from './user.schema';
const router = express.Router();

router.get(
  '/get-me',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.getMeController,
);

router.get('/', userController.getAllUserController);

router.get('/:id', userController.getSingleUserController);

router.get('/block-user', userController.getAllBlockedUserController);

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

router.post(
  '/block-user/:id',
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.blockAUserController,
);

router.post(
  '/unblock-user/:id',
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.unBlockAUserController,
);

router.delete(
  '/:id',
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.deleteAUserController,
);

export const userRoutes = router;
