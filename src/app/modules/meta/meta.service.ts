import AppError from '../../errors/AppError';
import { cartModel } from '../cart/cart.model';
import { OrderStatus } from '../orders/order.interface';
import { orderModel } from '../orders/order.model';
import { userModel } from '../user/user.model';
import { wishListModel } from '../wishList/wishList.model';

const userMetaService = async (userId: string) => {
  // Check if the user exists
  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError(403, `This user is not found.`);
  }

  // Check if the user is deleted
  if (user.isDeleted) {
    throw new AppError(403, `This user is not found.`);
  }

  // Check if the user is blocked
  if (user.isBlocked) {
    throw new AppError(403, `This user has been blocked.`);
  }

  // Aggregate order data by month and total price
  const orderStatsByMonth = await orderModel.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalPurchasePrice: { $sum: '$total' },
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.day': 1,
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $toString: '$_id.day' },
            '-',
            {
              $dateToString: {
                format: '%b',
                date: {
                  $dateFromParts: { year: '$_id.year', month: '$_id.month' },
                },
              },
            },
          ],
        },
        totalPurchasePrice: 1,
        orderCount: 1,
      },
    },
  ]);

  // Aggregate other order data
  const orderStats = await orderModel.aggregate([
    { $match: { user: userId } },
    {
      $facet: {
        totalOrders: [{ $count: 'count' }],
        totalPurchasePrice: [
          { $group: { _id: null, total: { $sum: '$total' } } },
        ],
        completedOrders: [
          { $match: { status: OrderStatus.DELIVERED } },
          { $count: 'count' },
        ],
        pendingOrders: [
          { $match: { status: OrderStatus.PENDING } },
          { $count: 'count' },
        ],
        returnedOrders: [
          { $match: { status: OrderStatus.RETURNED } },
          { $count: 'count' },
        ],
        unPaidOrders: [{ $match: { isPaid: false } }, { $count: 'count' }],
      },
    },
  ]);

  const wishListItem = await wishListModel
    .find({ user: userId })
    .estimatedDocumentCount();

  const cartItem = await cartModel
    .find({ user: userId })
    .estimatedDocumentCount();

  const stats = orderStats[0];

  return {
    totalOrders: stats.totalOrders[0]?.count || 0,
    wishListItem,
    cartItem,
    totalPurchasePrice: stats.totalPurchasePrice[0]?.total || 0,
    completedOrders: stats.completedOrders[0]?.count || 0,
    pendingOrders: stats.pendingOrders[0]?.count || 0,
    returnedOrders: stats.returnedOrders[0]?.count || 0,
    unPaidOrders: stats.unPaidOrders[0]?.count || 0,
    monthlyOrderStats: orderStatsByMonth,
  };
};

export const metaService = {
  userMetaService,
};
