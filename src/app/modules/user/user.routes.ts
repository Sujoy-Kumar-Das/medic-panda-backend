import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { userController } from './user.controller';
import { userValidationSchema } from './user.schema';
const router = express.Router();

router.get(
  '/user/get-me',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.getMeController,
);

// router.get('/user', userController.getAllUserController);

// router.get('/user/:id', userController.getSingleUserController);

// router.get('/users/blocked-user', userController.getAllBlockedUserController);

router.post(
  '/user/customer',
  validateRequest(userValidationSchema.createUserValidationSchema),
  userController.createCustomerController,
);

router.post(
  '/user/admin',
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidationSchema.createUserValidationSchema),
  userController.createAdminController,
);

router.patch(
  '/user/email',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidationSchema.updateUserEmailValidationSchema),
  userController.updateUserEmailController,
);

router.patch(
  '/user/verify-email',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.verifyEmailLinkController,
);

router.patch(
  '/user/confirm-verification-email',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.confirmEmailVerificationController,
);

// router.post(
//   '/user/block-user/:id',
//   // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
//   userController.blockAUserController,
// );

// router.post(
//   '/user/unblock-user/:id',
//   // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
//   userController.unBlockAUserController,
// );

// router.delete(
//   '/user/:id',
//   // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
//   userController.deleteAUserController,
// );

export const userRoutes = router;
