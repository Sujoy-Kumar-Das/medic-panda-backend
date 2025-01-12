import { emitSocketEvents } from '../../socket/emitSocket';
import { socketEvent } from '../../socket/socket.event';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { orderService } from './order.service';

const createOrderController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await orderService.createOrderService(userId, req.body);

  // emit socket event
  emitSocketEvents([{ event: socketEvent.order, data: result.order, userId }]);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order placed successfully.',
    data: result,
  });
});

const getAllOrderControllerByAdmin = catchAsync(async (req, res) => {
  const result = await orderService.getAllOrderServiceByAdmin();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order fetched successfully.',
    data: result,
  });
});

const getAllOrderController = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await orderService.getAllOrderService(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order fetched successfully.',
    data: result,
  });
});

const getSingleOrderController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await orderService.getSingleOrderService(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order fetched successfully.',
    data: result,
  });
});

const cancelOrderController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await orderService.cancelOrderService(userId, id);

  // emit socket event
  emitSocketEvents([{ event: socketEvent.order, data: result, userId }]);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order canceled successfully.',
    data: result,
  });
});

const deleteOrderController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const result = await orderService.deleteOrderService(userId, id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order canceled successfully.',
    data: result,
  });
});

export const orderController = {
  createOrderController,
  getAllOrderControllerByAdmin,
  getAllOrderController,
  getSingleOrderController,
  cancelOrderController,
  deleteOrderController,
};
