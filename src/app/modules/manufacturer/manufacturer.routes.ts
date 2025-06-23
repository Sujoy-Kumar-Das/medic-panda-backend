import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { manufacturerController } from './manufacturer.controller';
import { manufacturerValidationSchema } from './manufacturer.validation';

const router = Router();

router.post(
  '/manufacturer',
  validateRequest(
    manufacturerValidationSchema.createManufacturerValidationSchema,
  ),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  manufacturerController.createManufacturerController,
);

router.get(
  '/manufacturer',
  manufacturerController.getAllManufacturerController,
);

router.get(
  '/manufacturer/:id',
  manufacturerController.getSingleManufacturerController,
);

router.patch(
  '/manufacturer/:id',
  manufacturerController.updateManufacturerController,
);

router.delete(
  '/manufacturer/:id',
  manufacturerController.deleteManufacturerController,
);
export const manufacturerRouter = router;
