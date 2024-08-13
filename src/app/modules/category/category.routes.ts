import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { categoryController } from './category.controller';
import { categorySchema } from './category.schema';

const router = Router();

router.post(
  '/category',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(categorySchema.createCategorySchema),
  categoryController.createCategoryController,
);

router.get('/category', categoryController.getAllCategoryController);

router.get('/category/:id', categoryController.getSingleCategoryController);

router.patch(
  '/category',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(categorySchema.createCategorySchema),
  categoryController.updateCategoryController,
);

router.delete(
  '/category/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  categoryController.deleteCategoryController,
);

export const categoryRoutes = router;
