import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { reviewService } from './review.service';

const createReviewController = catchAsync(async (req, res) => {
  const result = await reviewService.createReviewService(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: 200,
    message: 'Review added successfully.',
  });
});

const getAllReviewController = catchAsync(async (req, res) => {
  const result = await reviewService.getAllReviewService({
    productId: req.params.productId,
  });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: 200,
    message: 'Review fetched successfully.',
  });
});

const deleteReviewController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.params;
  const result = await reviewService.deleteReviewService(productId, userId);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: 200,
    message: 'Review deleted successfully.',
  });
});

export const reviewController = {
  createReviewController,
  getAllReviewController,
  deleteReviewController,
};
