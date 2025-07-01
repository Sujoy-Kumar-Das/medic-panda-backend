/* eslint-disable @typescript-eslint/no-explicit-any */

import { Model } from 'mongoose';
import { productModel } from '../modules/product/porduct.model';

export const updateExpiredDiscountsBulk = async function (model: Model<any>) {
  const now = new Date();
  const currentDateStr = now.toISOString().split('T')[0];
  const currentTimeStr = now.toTimeString().substring(0, 5);

  const result = await model.updateMany(
    {
      discount: { $exists: true, $ne: null },
      isDeleted: { $ne: true },
      $or: [
        { 'discount.endDate': { $lt: currentDateStr } },
        {
          'discount.endDate': currentDateStr,
          'discount.endTime': { $lt: currentTimeStr },
        },
      ],
    },
    { $set: { discount: null } },
  );

  return result;
};

export const updateExpiredDiscountsForFetchedProducts = async (
  products: any,
): Promise<any[]> => {
  if (!products) return [];

  const normalizedProducts = Array.isArray(products) ? products : [products];
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().substring(0, 5);

  const expiredIds = normalizedProducts
    .filter((product) => {
      const discount = product.discount;
      if (!discount) return false;

      const discountEndDate = new Date(discount.endDate)
        .toISOString()
        .split('T')[0];

      return (
        discountEndDate < currentDate ||
        (discountEndDate === currentDate && discount.endTime < currentTime)
      );
    })
    .map((p) => p._id);

  if (expiredIds.length > 0) {
    await productModel.updateMany(
      { _id: { $in: expiredIds } },
      { $set: { discount: null } },
    );

    normalizedProducts.forEach((p) => {
      if (expiredIds.some((id) => id.equals(p._id))) {
        p.discount = null;
      }
    });
  }

  return normalizedProducts;
};
