import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { cartController } from './cart.controller';
import CartValidationSchema from './cart.validation.schema';

const router = Router();

router.post(
  '/cart',
  validateRequest(CartValidationSchema),
  auth(USER_ROLE.user),
  cartController.createCartController,
);

router.get(
  '/cart',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  cartController.getAllCartProductController,
);

router.patch(
  '/cart',
  validateRequest(CartValidationSchema),
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  cartController.removeFromCartByQuantityController,
);

router.delete(
  '/cart/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  cartController.removeCartProductController,
);

export const cartRouter = router;
