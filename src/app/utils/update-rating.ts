import { Types } from 'mongoose';
import { productModel } from '../modules/product/porduct.model';
import { reviewModel } from '../modules/reviews/review.model';

export const updateProductRating = async (
  productId: Types.ObjectId | string,
) => {
  const stats = await reviewModel.aggregate([
    { $match: { product: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$product',
        average: { $avg: '$rating' },
        count: { $sum: 1 },
        newest: { $max: '$createdAt' },
      },
    },
  ]);

  const update = {
    'rating.average': stats[0]?.average || 0,
    'rating.count': stats[0]?.count || 0,
    'rating.lastUpdated': stats[0]?.newest || new Date(),
  };

  await productModel.findByIdAndUpdate(productId, { $set: update });
};

export const updateRatingsForFetchedProducts = async () => {
  const products = await productModel.find().lean();

  const ratingData = await reviewModel.aggregate([
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalCount: { $sum: 1 },
        newestReview: { $max: '$createdAt' },
      },
    },
  ]);

  const updatedData = products.map((product) => {
    const currentRating = ratingData.find((review) =>
      review._id.equals(product._id),
    );

    const update = {
      'rating.average': currentRating?.averageRating || 0,
      'rating.count': currentRating?.totalCount || 0,
      'rating.lastUpdated': currentRating?.newestReview || new Date(),
    };

    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $set: update },
      },
    };
  });

  if (updatedData.length > 0) {
    await productModel.bulkWrite(updatedData);
  }
};
