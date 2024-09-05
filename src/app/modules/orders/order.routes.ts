import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { orderController } from './order.controller';
import { orderValidationSchema } from './order.validationSchema';

const router = Router();

router.post(
  '/order',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(orderValidationSchema.createOrderValidationSchema),
  orderController.createOrderController,
);

router.get(
  '/order/admin',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  orderController.getAllOrderControllerByAdmin,
);

router.get(
  '/order/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  orderController.getAllOrderController,
);

router.delete(
  '/order/cancel/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  orderController.cancelOrderController,
);

router.delete(
  '/order/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  orderController.deleteOrderController,
);

export const orderRoutes = router;