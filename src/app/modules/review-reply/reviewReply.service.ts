/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { reviewModel } from '../reviews/review.model';
import { IReply } from './reviewReply.interface';
import { replyModel } from './reviewReply.model';

const addReplyService = async (
  reviewId: string,
  userId: string,
  payload: Partial<IReply>,
) => {
  const review = await reviewModel.findById(reviewId);

  if (!review) {
    throw new AppError(404, 'This review is not found.');
  }

  const replyData: IReply = {
    reply: payload.reply as string,
    review: review._id,
    user: new Types.ObjectId(userId),
  };

  const result = await replyModel.create(replyData);

  if (!result) {
    throw new AppError(401, 'Failed to add reply to this review.');
  }

  return result;
};

const getAllReplyService = async (reviewId: string) => {
  const replies = await replyModel.find({ review: reviewId }).populate({
    path: 'user',
    select: '_id',
    populate: {
      path: 'customer',
      select: 'name photo',
    },
  });

  return replies.map((reply: any) => ({
    _id: reply._id,
    reviewId: reply.review,
    reply: reply.reply,
    user: reply.user?.customer
      ? {
          _id: reply.user._id,
          name: reply.user.customer.name,
          photo: reply.user.customer.photo,
        }
      : null,
  }));
};

const getSingleReplyService = async (replyId: string) => {
  const reply = await replyModel.findById(replyId).populate({
    path: 'user',
    select: '_id',
    populate: {
      path: 'customer',
      select: 'name photo',
    },
  });

  if (!reply) {
    throw new AppError(404, 'This Reply is not found.');
  }

  const user = reply?.user as any;

  return {
    _id: reply._id,
    reviewId: reply.review,
    reply: reply.reply,
    user: user.customer
      ? {
          _id: user._id,
          name: user.customer.name,
          photo: user.customer.photo,
        }
      : null,
  };
};

const editReplyService = async (
  userId: Types.ObjectId,
  replyId: string,
  payload: Partial<IReply>,
) => {
  const reply = await replyModel.findById(replyId);

  if (!reply) {
    throw new AppError(404, 'This reply is not found.');
  }

  if (!userId.equals(reply.user)) {
    throw new AppError(403, "Access denied! You can't delete this comment.");
  }

  return await replyModel.findByIdAndUpdate(replyId, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteReplyService = async (userId: Types.ObjectId, replyId: string) => {
  const reply = await replyModel.findById(replyId);

  if (!reply) {
    throw new AppError(404, 'This reply is not found.');
  }

  if (!userId.equals(reply.user)) {
    throw new AppError(403, "Access denied! You can't delete this comment.");
  }

  await replyModel.findByIdAndDelete(replyId);

  return null;
};

export const replyService = {
  addReplyService,
  getAllReplyService,
  getSingleReplyService,
  editReplyService,
  deleteReplyService,
};
