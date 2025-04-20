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

const addReplyController = catchAsync(async (req, res) => {
  const result = await reviewService.addReplyService(
    req.params.reviewId,
    req.user.userId,
    req.body,
  );
  sendResponse(res, {
    data: null,
    success: true,
    statusCode: 200,
    message: 'Reply added successfully.',
  });
});

const getAllReviewController = catchAsync(async (req, res) => {
  const result = await reviewService.getAllReviewServiceByProduct({
    productId: req.params.productId,
  });
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: 200,
    message: 'Review fetched successfully.',
  });
});

const getReviewDetailsController = catchAsync(async (req, res) => {
  const result = await reviewService.getReviewDetailsService({
    reviewId: req.params.reviewId,
  });

  sendResponse(res, {
    data: result,
    success: true,
    statusCode: 200,
    message: 'Review Details fetched successfully.',
  });
});

const editReviewController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { reviewId } = req.params;
  const result = await reviewService.editReviewService(
    userId,
    reviewId,
    req.body,
  );
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: 200,
    message: 'Review Updated successfully.',
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
  addReplyController,
  getAllReviewController,
  getReviewDetailsController,
  editReviewController,
  deleteReviewController,
};
