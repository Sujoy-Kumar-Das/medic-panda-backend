import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './porduct.controller';
import { productValidationSchema } from './porduct.validation.schema';

const router = Router();

router.post(
  '/product',
  validateRequest(productValidationSchema.createProductValidationSchema),
  ProductController.createProductController,
);

export const productRoutes = router;
