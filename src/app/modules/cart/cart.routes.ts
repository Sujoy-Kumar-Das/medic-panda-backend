import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { cartController } from './cart.controller';

const router = Router();

router.post('/cart', auth(USER_ROLE.user), cartController.createCartController);

router.get(
  '/cart',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  cartController.getAllCartProductController,
);

router.get(
  '/cart/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  cartController.getSingleCartProductController,
);

router.delete(
  '/cart/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  cartController.removeCartProductController,
);

export const cartRouter = router;
