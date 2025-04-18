import AppError from '../../errors/AppError';
import { productModel } from '../product/porduct.model';
import { IReview } from './review.interface';
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

const getAllReviewService = async ({ productId }: { productId: string }) => {
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
    .sort('-createdAt');

  const result = reviews.map((review) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = review.user as any;
    const customer = user?.customer;

    return {
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
  });

  return result;
};

export const reviewService = {
  createReviewService,
  getAllReviewService,
};
