import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { replyService } from './reviewReply.service';

const addReplyController = catchAsync(async (req, res) => {
  const result = await replyService.addReplyService(
    req.params.reviewId,
    req.user.userId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Reply is added successfully',
  });
});

const getAllReplyController = catchAsync(async (req, res) => {
  const result = await replyService.getAllReplyService(req.params.reviewId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Reply is fetched successfully',
  });
});

const getSingleReplyController = catchAsync(async (req, res) => {
  const result = await replyService.getSingleReplyService(req.params.replyId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Reply is fetched successfully',
  });
});

const editReplyController = catchAsync(async (req, res) => {
  const result = await replyService.editReplyService(
    req.user.userId,
    req.params.reviewId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Reply is updated successfully',
  });
});

const deleteReplyController = catchAsync(async (req, res) => {
  const result = await replyService.deleteReplyService(
    req.user.userId,
    req.params.reviewId,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Reply is added successfully',
  });
});

export const replyController = {
  addReplyController,
  getAllReplyController,
  getSingleReplyController,
  editReplyController,
  deleteReplyController,
};
