import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { userController } from './user.controller';
import { userValidationSchema } from './user.schema';
const router = express.Router();

// get me route
router.get(
  '/user/get-me',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.getMeController,
);

// get all users
router.get(
  '/user',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.getAllUserController,
);

router.get('/user/:id', userController.getSingleUserController);

router.post(
  '/user/customer',
  validateRequest(userValidationSchema.createUserValidationSchema),
  userController.createCustomerController,
);

router.post(
  '/user/admin',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(userValidationSchema.createAdminValidationSchema),
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

router.patch(
  '/user/block-user',
  validateRequest(userValidationSchema.blockUserSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.blockAUserController,
);

router.patch(
  '/user/unblock-user',
  validateRequest(userValidationSchema.blockUserSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.unBlockAUserController,
);

router.delete(
  '/user',
  validateRequest(userValidationSchema.deleteUserSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  userController.deleteAUserController,
);

router.patch(
  '/user',
  validateRequest(userValidationSchema.updateUserValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.user),
  userController.updateUserInfoController,
);

export const userRoutes = router;
