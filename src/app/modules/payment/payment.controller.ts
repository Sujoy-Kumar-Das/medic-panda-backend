import config from '../../config';
import { emitSocketEvent } from '../../socket/emitSocket';
import { socketEvent } from '../../socket/socket.event';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { paymentService } from './payment.service';

const payNowController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await paymentService.payNowService(userId, id);

  console.log(result);

  sendResponse(res, {
    success: true,
    message: 'Payment successful',
    statusCode: 200,
    data: result,
  });
});

const successPaymentController = catchAsync(async (req, res) => {
  const { userId } = await paymentService.successPaymentService(req.body);

  // emit socket event
  emitSocketEvent(socketEvent.order, userId, userId.toString());

  res.redirect(config.success_frontend_link as string);
});

const cancelPaymentController = catchAsync(async (req, res) => {
  const result = await paymentService.failedPaymentService(req.body.tran_id);
  res.redirect(result);
});

const failedPaymentController = catchAsync(async (req, res) => {
  const result = await paymentService.failedPaymentService(req.body.tran_id);
  res.redirect(result);
});

const paymentHistoryController = catchAsync(async (req, res) => {
  const result = await paymentService.paymentHistory(req.user.userId);

  sendResponse(res, {
    message: 'Payment history fetched successfully.',
    statusCode: 200,
    success: true,
    data: result,
  });
});

export const paymentController = {
  successPaymentController,
  failedPaymentController,
  cancelPaymentController,
  payNowController,
  paymentHistoryController,
};
