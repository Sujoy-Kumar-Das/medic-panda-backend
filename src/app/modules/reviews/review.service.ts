import { IReview } from './review.interface';
import { reviewModel } from './review.model';

const createReviewService = async (payload: IReview) => {
  const result = await reviewModel.create(payload);
  return result;
};

export const reviewService = {
  createReviewService,
};
