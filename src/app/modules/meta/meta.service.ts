import { cartModel } from '../cart/cart.model';
import { OrderStatus } from '../orders/order.interface';
import { orderModel } from '../orders/order.model';
import { productDetailModel } from '../porductDetail/productDetail.model';
import { productModel } from '../product/porduct.model';
import { userModel } from '../user/user.model';
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

const adminMetaDataService = async () => {
  const [
    usersAggregation,
    productsAggregation,
    productDetailsAggregation,
    ordersAggregation,
  ] = await Promise.all([
    userModel.aggregate([
      {
        $facet: {
          total: [{ $count: 'total' }],
          admins: [{ $match: { role: 'admin' } }, { $count: 'total' }],
          customers: [{ $match: { role: 'user' } }, { $count: 'total' }],
        },
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ['$total.total', 0] }, 0] },
          admins: { $ifNull: [{ $arrayElemAt: ['$admins.total', 0] }, 0] },
          customers: {
            $ifNull: [{ $arrayElemAt: ['$customers.total', 0] }, 0],
          },
        },
      },
    ]),

    productModel.aggregate([
      {
        $facet: {
          total: [{ $count: 'total' }],
          wishList: [{ $match: { isWishList: true } }, { $count: 'total' }],
        },
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ['$total.total', 0] }, 0] },
          wishList: { $ifNull: [{ $arrayElemAt: ['$wishList.total', 0] }, 0] },
        },
      },
    ]),

    productDetailModel.aggregate([
      {
        $facet: {
          active: [{ $match: { status: 'active' } }, { $count: 'total' }],
          inactive: [{ $match: { status: 'inactive' } }, { $count: 'total' }],
        },
      },
      {
        $project: {
          active: { $ifNull: [{ $arrayElemAt: ['$active.total', 0] }, 0] },
          inactive: { $ifNull: [{ $arrayElemAt: ['$inactive.total', 0] }, 0] },
        },
      },
    ]),

    orderModel.aggregate([
      {
        $facet: {
          total: [{ $count: 'total' }],
          pending: [
            { $match: { status: OrderStatus.PENDING } },
            { $count: 'total' },
          ],
          paid: [{ $match: { status: OrderStatus.PAID } }, { $count: 'total' }],
          processing: [
            { $match: { status: OrderStatus.PROCESSING } },
            { $count: 'total' },
          ],
          shifted: [
            { $match: { status: OrderStatus.SHIPPED } },
            { $count: 'total' },
          ],
          delivered: [
            { $match: { status: OrderStatus.DELIVERED } },
            { $count: 'total' },
          ],
          returned: [
            { $match: { status: OrderStatus.RETURNED } },
            { $count: 'total' },
          ],
          canceled: [
            { $match: { status: OrderStatus.CANCELED } },
            { $count: 'total' },
          ],
        },
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ['$total.total', 0] }, 0] },
          pending: { $ifNull: [{ $arrayElemAt: ['$pending.total', 0] }, 0] },
          paid: { $ifNull: [{ $arrayElemAt: ['$paid.total', 0] }, 0] },
          processing: {
            $ifNull: [{ $arrayElemAt: ['$processing.total', 0] }, 0],
          },
          shifted: { $ifNull: [{ $arrayElemAt: ['$shifted.total', 0] }, 0] },
          delivered: {
            $ifNull: [{ $arrayElemAt: ['$delivered.total', 0] }, 0],
          },
          returned: { $ifNull: [{ $arrayElemAt: ['$returned.total', 0] }, 0] },
          canceled: { $ifNull: [{ $arrayElemAt: ['$canceled.total', 0] }, 0] },
        },
      },
    ]),
  ]);

  const dashboardStats = [
    { title: 'Total Users', value: usersAggregation[0].total },
    { title: 'Admin Users', value: usersAggregation[0].admins },
    { title: 'Customer Users', value: usersAggregation[0].customers },
    { title: 'Total Products', value: productsAggregation[0].total },
    { title: 'Wishlist Products', value: productsAggregation[0].wishList },
    { title: 'Active Products', value: productDetailsAggregation[0].active },
    {
      title: 'Inactive Products',
      value: productDetailsAggregation[0].inactive,
    },
    { title: 'Total Orders', value: ordersAggregation[0].total },
    { title: 'Orders Pending', value: ordersAggregation[0].pending },
    { title: 'Paid Orders', value: ordersAggregation[0].paid },
    { title: 'Orders Processing', value: ordersAggregation[0].processing },
    { title: 'Orders Shifted', value: ordersAggregation[0].shifted },
    { title: 'Orders Delivered', value: ordersAggregation[0].delivered },
    { title: 'Returned Orders', value: ordersAggregation[0].returned },
    { title: 'Canceled Orders', value: ordersAggregation[0].canceled },
  ];

  return {
    dashboardStats,
  };
};

export const metaService = {
  userMetaService,
  adminMetaDataService,
};
