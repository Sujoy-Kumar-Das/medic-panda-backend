import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { userValidationSchema } from '../user/user.schema';
import { adminController } from './admin.controller';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  adminController.getAllAdminController,
);

router.get(
  '/detail/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  adminController.getSingleAdminController,
);

router.get(
  '/block',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  adminController.getBlockedAdminController,
);

router.get(
  '/delete',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  adminController.getDeletedAdminController,
);

router.patch(
  '/block/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  adminController.blockAdminController,
);

router.delete(
  '/delete/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  adminController.deleteAdminController,
);

router.patch(
  '/',
  validateRequest(userValidationSchema.updateUserValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  adminController.updateAdminInfo,
);

export const adminRouter = router;
