import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { wishListController } from './wishList.controller';

const router = Router();

router.post(
  '/wish-list',
  auth(USER_ROLE.user),
  wishListController.createWishListController,
);

router.get(
  '/wish-list',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  wishListController.getAllWishListProductController,
);

router.get(
  '/wish-list/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  wishListController.getSingleWishListProductController,
);

router.delete(
  '/wish-list/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  wishListController.removeWishListProductController,
);

export const wishListRouter = router;
