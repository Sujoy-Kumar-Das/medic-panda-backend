/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { productModel } from '../product/porduct.model';
import { IReply, IReview } from './review.interface';
import { reviewModel } from './review.model';

const createReviewService = async (payload: IReview) => {
  const product = await productModel.findOne({
    _id: payload.product,
    isDeleted: false,
  });

  if (!product) {
    throw new AppError(404, 'This product is not found.');
  }

  const result = await reviewModel.create(payload);
  return result;
};

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
    user: new Types.ObjectId(userId),
  };

  const updatedReview = await reviewModel.findByIdAndUpdate(
    reviewId,
    {
      $push: {
        replies: replyData,
      },
    },
    { new: true, runValidators: true },
  );

  if (!updatedReview) {
    throw new AppError(404, 'Failed to add reply');
  }

  return updatedReview;
};

const getReviewDetailsService = async ({ reviewId }: { reviewId: string }) => {
  const review = await reviewModel.findById(reviewId).populate({
    path: 'user',
    select: '_id',
    populate: {
      path: 'customer',
      select: 'name photo',
    },
  });

  if (!review) {
    throw new AppError(404, 'This review is not found.');
  }

  const user = review?.user as any;
  const customer = user?.customer;

  const result = {
    _id: review._id,
    comment: review.comment,
    rating: review.rating,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    user:
      user && customer
        ? {
            _id: user._id,
            name: customer.name,
            photo: customer.photo,
          }
        : null,
  };

  return result;
};

const getAllReviewServiceByProduct = async ({
  productId,
}: {
  productId: string;
}) => {
  const reviews = await reviewModel
    .find({ product: productId })
    .populate({
      path: 'user',
      select: '_id',
      populate: {
        path: 'customer',
        select: 'name photo',
      },
    })
    .populate({
      path: 'replies.user',
      select: '_id',
      populate: {
        path: 'customer',
        select: 'name photo',
      },
    })
    .sort('-createdAt');

  const result = reviews.map((review) => {
    const user = review.user as any;
    const customer = user?.customer;

    const replies = review.replies as any;

    const modifiedReplies = replies.map((reply: any) => ({
      reply: reply.reply,
      _id: reply._id,
      user: {
        name: reply.user.customer.name,
        photo: reply.user.customer.photo,
        _id: reply.user._id,
      },
    }));

    return {
      _id: review._id,
      comment: review.comment,
      rating: review.rating,
      replies: modifiedReplies,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user:
        user && customer
          ? {
              _id: user._id,
              name: customer.name,
              photo: customer.photo,
            }
          : null,
    };
  });

  return result;
};

const editReviewService = async (
  userId: Types.ObjectId,
  reviewId: string,
  payload: Partial<IReview>,
) => {
  const review = await reviewModel.findById(reviewId);

  if (!review) {
    throw new AppError(404, 'This review is not found.');
  }

  if (!userId.equals(review.user)) {
    throw new AppError(403, "Access denied! You can't delete this comment.");
  }

  return await reviewModel.findByIdAndUpdate(reviewId, payload, { new: true });
};

const deleteReviewService = async (id: string, userId: Types.ObjectId) => {
  const review = await reviewModel.findById(id);

  if (!review) {
    throw new AppError(404, 'This review is not found.');
  }

  if (!userId.equals(review.user)) {
    throw new AppError(403, "Access denied! You can't delete this comment.");
  }

  await reviewModel.findByIdAndDelete(id);

  return null;
};

export const reviewService = {
  createReviewService,
  addReplyService,
  getAllReviewServiceByProduct,
  getReviewDetailsService,
  editReviewService,
  deleteReviewService,
};
