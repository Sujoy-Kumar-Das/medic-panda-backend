import { cartModel } from '../cart/cart.model';
import { OrderStatus } from '../orders/order.interface';
import { orderModel } from '../orders/order.model';
import { productDetailModel } from '../porductDetail/productDetail.model';
import { productModel } from '../product/porduct.model';
import { userModel } from '../user/user.model';
import { wishListModel } from '../wishList/wishList.model';

const userMetaService = async (userId: string) => {
  const ordersAggregation = orderModel.aggregate([
    { $match: { user: userId } },
    {
      $facet: {
        totalOrders: [{ $count: 'totalOrders' }],
        completedOrders: [
          { $match: { status: OrderStatus.DELIVERED } },
          { $count: 'completedOrders' },
        ],
        totalPurchaseAmount: [
          {
            $match: {
              status: OrderStatus.DELIVERED,
            },
          },
          {
            $group: {
              _id: null,
              totalPurchaseAmount: { $sum: '$total' },
            },
          },
          { $count: 'totalPurchaseAmount' },
        ],
        pendingOrders: [
          { $match: { status: OrderStatus.PENDING } },
          { $count: 'pendingOrders' },
        ],
        returnedOrders: [
          { $match: { status: OrderStatus.RETURNED } },
          { $count: 'returnedOrders' },
        ],
        unpaidOrders: [
          { $match: { isPaid: false } },
          { $count: 'unpaidOrders' },
        ],
        paidOrders: [{ $match: { isPaid: true } }, { $count: 'paidOrders' }],
        canceledOrders: [
          { $match: { status: OrderStatus.CANCELED } },
          { $count: 'canceledOrders' },
        ],
      },
    },
    {
      $project: {
        totalOrders: {
          $ifNull: [{ $arrayElemAt: ['$totalOrders.totalOrders', 0] }, 0],
        },
        totalPaidOrder: {
          $ifNull: [{ $arrayElemAt: ['$paidOrders.paidOrders', 0] }, 0],
        },
        totalCompletedOrders: {
          $ifNull: [
            { $arrayElemAt: ['$completedOrders.completedOrders', 0] },
            0,
          ],
        },
        totalPendingOrders: {
          $ifNull: [{ $arrayElemAt: ['$pendingOrders.pendingOrders', 0] }, 0],
        },
        totalUnpaid: {
          $ifNull: [{ $arrayElemAt: ['$unpaidOrders.unpaidOrders', 0] }, 0],
        },
        totalReturnedOrders: {
          $ifNull: [{ $arrayElemAt: ['$returnedOrders.returnedOrders', 0] }, 0],
        },
        totalCancelOrder: {
          $ifNull: [{ $arrayElemAt: ['$canceledOrders.canceledOrders', 0] }, 0],
        },
        totalPurchaseAmount: {
          $ifNull: [
            { $arrayElemAt: ['$totalPurchaseAmount.totalPurchaseAmount', 0] },
            0,
          ],
        },
      },
    },
  ]);

  const wishlistCount = wishListModel.countDocuments({ user: userId });
  const cartCount = cartModel.countDocuments({ user: userId });

  const [orderCount, totalWishListItem, totalCartItem] = await Promise.all([
    ordersAggregation,
    wishlistCount,
    cartCount,
  ]);

  const orderStats = orderCount[0];

  const result = [
    { title: 'Total Orders', value: orderStats?.totalOrders },
    { title: 'Completed Orders', value: orderStats?.totalCompletedOrders },
    { title: 'Pending Orders', value: orderStats?.totalPendingOrders },
    { title: 'Canceled Orders', value: orderStats?.totalCancelOrder },
    { title: 'Returned Orders', value: orderStats?.totalReturnedOrders },
    { title: 'Paid Orders', value: orderStats?.totalPaidOrder },
    { title: 'Unpaid Orders', value: orderStats?.totalUnpaid },
    { title: 'Total Purchase Amount', value: orderStats?.totalPurchaseAmount },
    { title: 'Total Wishlist Items', value: totalWishListItem },
    { title: 'Total Cart Items', value: totalCartItem },
  ];

  return result;
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
