import { IReview } from './review.interface';
import { reviewModel } from './review.model';

const getAllReviewService = async () => {
  const result = await reviewModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    { $unwind: '$userInfo' },
    {
      $lookup: {
        from: 'customers',
        localField: 'userInfo._id',
        foreignField: 'user',
        as: 'customerInfo',
      },
    },
    { $unwind: '$customerInfo' },
    {
      $project: {
        _id: 1,
        product: 1,
        comment: 1,
        rating: 1,
        replies: 1,
        createdAt: 1,
        userInfo: {
          email: '$userInfo.email',
          userId: '$userInfo._id',
          photo: '$customerInfo.photo',
          name: '$customerInfo.name',
        },
      },
    },
    { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
  ]);

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
