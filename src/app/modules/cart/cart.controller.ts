import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { cartService } from './cart.service';

const createCartController = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await cartService.createCartService({
    user: userId,
    product: req.body,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product added in cart.',
    data: result,
  });
});

const getAllCartProductController = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await cartService.getAllCartProductService(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart product fetched successfully.',
    data: result,
  });
});

const getSingleCartProductController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await cartService.getSingleCartProductService(userId, id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Wish list product fetched successfully.',
    data: result,
  });
});

const removeCartProductController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await cartService.removeFromCartService(userId, id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart product removed successfully.',
    data: result,
  });
});

export const cartController = {
  createCartController,
  getAllCartProductController,
  getSingleCartProductController,
  removeCartProductController,
};