/* eslint-disable @typescript-eslint/no-explicit-any */

import { Model } from 'mongoose';

const updateExpiredDiscounts = async function (model: Model<any>) {
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

export default updateExpiredDiscounts;
