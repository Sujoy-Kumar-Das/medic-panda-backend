import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { variantController } from './variants.controller';
import { variantValidationSchema } from './variants.validation.schema';

const router = Router();

router.post(
  '/variant',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(variantValidationSchema.createVariantValidationSchema),
  variantController.createVariantController,
);

router.get('/variant', variantController.getAllVariantController);

router.get('/variant/:id', variantController.getSingleVariantController);

router.patch(
  '/variant/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(variantValidationSchema.updateVariantValidationSchema),
  variantController.updateVariantController,
);

router.delete(
  '/variant/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  variantController.deleteVariantController,
);

export const variantRoutes = router;
