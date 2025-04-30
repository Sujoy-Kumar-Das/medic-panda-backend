import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { cartController } from './cart.controller';
import { cartValidationSchema } from './cart.validation.schema';

const router = Router();

router.post(
  '/cart',
  validateRequest(cartValidationSchema.createCartValidationSchema),
  auth(USER_ROLE.user),
  cartController.createCartController,
);

router.get(
  '/cart',
  auth(USER_ROLE.user),
  cartController.getAllCartProductController,
);

router.get(
  '/cart-length',
  auth(USER_ROLE.user),
  cartController.getCartLengthController,
);

router.get(
  '/cart/:id',
  auth(USER_ROLE.user),
  cartController.getSingleCartProductController,
);

router.patch(
  '/cart/increment/:id',
  validateRequest(cartValidationSchema.updateCartValidationSchema),
  auth(USER_ROLE.user),
  cartController.incrementCartProductController,
);

router.patch(
  '/cart/decrement/:id',
  auth(USER_ROLE.user),
  cartController.decrementCartController,
);

router.delete(
  '/cart/:id',
  auth(USER_ROLE.user),
  cartController.deleteCartController,
);

export const cartRouter = router;
