import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { reviewService } from './review.service';

const getAllReviewController = catchAsync(async (req, res) => {
  const result = await reviewService.getAllReviewService();
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: 200,
    message: 'Review fetched successfully.',
  });
});

const createReviewController = catchAsync(async (req, res) => {
  const result = await reviewService.createReviewService(req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: 200,
    message: 'Review added successfully.',
  });
});

export const reviewController = {
  createReviewController,
  getAllReviewController,
};
