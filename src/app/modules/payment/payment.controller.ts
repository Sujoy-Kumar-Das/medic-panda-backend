import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentService } from './payment.service';

const payNowController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await paymentService.payNowService(userId, id);

  sendResponse(res, {
    success: true,
    message: 'Payment successful',
    statusCode: 200,
    data: result,
  });
});

const successPaymentController = catchAsync(async (req, res) => {
  await paymentService.successPaymentService(req.body);

  res.redirect(config.success_frontend_link as string);
});

const cancelPaymentController = catchAsync(async (req, res) => {
  console.log('cancel', req.body);
  res.redirect(config.failed_frontend_link as string);
});

const failedPaymentController = catchAsync(async (req, res) => {
  res.redirect(config.failed_frontend_link as string);
});

export const paymentController = {
  successPaymentController,
  failedPaymentController,
  cancelPaymentController,
  payNowController,
};
