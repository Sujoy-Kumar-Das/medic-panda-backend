import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { orderService } from './order.service';

const createOrderController = catchAsync(async (req, res) => {
  const result = await orderService.createOrderService(req.body);

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
  const { id } = req.params;
  const { email, role } = req.user;

  const result = await orderService.getAllOrderService(id, email, role);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order fetched successfully.',
    data: result,
  });
});

const cancelOrderController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.user;

  const result = await orderService.cancelOrderService(id, email, role);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order canceled successfully.',
    data: result,
  });
});

const deleteOrderController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.user;

  const result = await orderService.deleteOrderService(id, email, role);

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
  cancelOrderController,
  deleteOrderController,
};
