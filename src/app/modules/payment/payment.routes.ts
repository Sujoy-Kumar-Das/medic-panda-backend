import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { paymentController } from './payment.controller';

const router = Router();

router.post('/success-payment', paymentController.successPaymentController);

router.post('/cancel-payment', paymentController.cancelPaymentController);

router.post('/failed-payment', paymentController.failedPaymentController);

router.post(
  '/pay-now/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  paymentController.payNowController,
);

router.get(
  '/payment',
  auth(USER_ROLE.user),
  paymentController.paymentHistoryController,
);

export const paymentRouter = router;
