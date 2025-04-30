import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { cartService } from './cart.service';

const createCartController = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const { product, quantity } = req.body;

  const result = await cartService.createCartService({
    user: userId,
    product: product,
    quantity,
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

const getCartLengthController = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await cartService.getCartLengthService(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart length fetched successfully.',
    data: result,
  });
});

const getSingleCartProductController = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const { id } = req.params;

  const result = await cartService.getSingleCartProductService({
    id,
    userId,
    role,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart product fetched successfully.',
    data: result,
  });
});

const incrementCartProductController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const result = await cartService.incrementCartItemService(id, { quantity });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Cart product updated successfully.',
    data: result,
  });
});

const decrementCartController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await cartService.decrementCartService(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product removed from cart successfully.',
    data: result,
  });
});

const deleteCartController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await cartService.deleteCartService(id, userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product removed from your cart successfully.',
    data: result,
  });
});

export const cartController = {
  createCartController,
  getSingleCartProductController,
  getAllCartProductController,
  decrementCartController,
  incrementCartProductController,
  getCartLengthController,
  deleteCartController,
};
