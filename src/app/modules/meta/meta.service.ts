import { cartModel } from '../cart/cart.model';
import { OrderStatus } from '../orders/order.interface';
import { orderModel } from '../orders/order.model';
import { wishListModel } from '../wishList/wishList.model';

const userMetaService = async (userId: string) => {
  // Aggregate key order stats
  const orderStats = await orderModel.aggregate([
    { $match: { user: userId } },
    {
      $facet: {
        totalOrders: [{ $count: 'count' }], // Total orders count
        totalPurchaseAmount: [
          { $group: { _id: null, total: { $sum: '$total' } } },
        ], // Sum of all purchase prices
        completedOrders: [
          { $match: { status: OrderStatus.DELIVERED } },
          { $count: 'count' },
        ], // Delivered orders count
        pendingOrders: [
          { $match: { status: OrderStatus.PENDING } },
          { $count: 'count' },
        ], // Pending orders count
        returnedOrders: [
          { $match: { status: OrderStatus.RETURNED } },
          { $count: 'count' },
        ], // Returned orders count
        unpaidOrders: [{ $match: { isPaid: false } }, { $count: 'count' }],
      },
    },
  ]);

  // Wishlist and cart items count
  const wishlistCount = await wishListModel.countDocuments({ user: userId });
  const cartCount = await cartModel.countDocuments({ user: userId });

  console.log({ cartCount });

  // Extract stats with fallback values
  const stats = orderStats[0];

  return {
    totalOrders: stats.totalOrders[0]?.count || 0,
    totalPurchaseAmount: stats.totalPurchaseAmount[0]?.total || 0,
    completedOrders: stats.completedOrders[0]?.count || 0,
    pendingOrders: stats.pendingOrders[0]?.count || 0,
    returnedOrders: stats.returnedOrders[0]?.count || 0,
    wishlistCount,
    cartCount,
    unpaidOrders: stats.unpaidOrders[0]?.count || 0,
  };
};

export const metaService = {
  userMetaService,
};
