import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { ProductController } from './porduct.controller';
import { productValidationSchema } from './porduct.validation.schema';

const router = Router();

router.post(
  '/product',
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(productValidationSchema.createProductValidationSchema),
  ProductController.createProductController,
);

router.get('/product', ProductController.getAllProductController);

router.get('/product/:id', ProductController.getSingleProductController);

router.delete(
  '/product/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ProductController.deleteProductController,
);

export const productRoutes = router;
