import { IReview } from './review.interface';
import { reviewModel } from './review.model';

const getAllReviewService = async () => {
  const result = await reviewModel.find();
  return result;
};

const createReviewService = async (payload: IReview) => {
  const result = await reviewModel.create(payload);
  return result;
};

export const reviewService = {
  createReviewService,
  getAllReviewService,
};
