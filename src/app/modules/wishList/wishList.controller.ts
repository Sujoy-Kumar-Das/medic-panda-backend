import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { wishListService } from './wishList.service';

const createWishListController = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await wishListService.createWishListService({
    user: userId,
    product: req.body.product,
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Product added in wish list.',
    data: result,
  });
});

const getAllWishListProductController = catchAsync(async (req, res) => {
  const { userId, role } = req.user;

  const result = await wishListService.getAllWishListProductService(
    userId,
    role,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Wish list product fetched successfully.',
    data: result,
  });
});

const getSingleWishListProductController = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const { id } = req.params;

  const result = await wishListService.getSingleWishListProductService(
    userId,
    id,
    role,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Wish list product fetched successfully.',
    data: result,
  });
});

const removeWishListProductController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const result = await wishListService.removeFromWishListService(userId, id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Wish list product removed successfully.',
    data: result,
  });
});

export const wishListController = {
  createWishListController,
  getAllWishListProductController,
  getSingleWishListProductController,
  removeWishListProductController,
};
