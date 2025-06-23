"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaService = void 0;
const cart_model_1 = require("../cart/cart.model");
const order_interface_1 = require("../orders/order.interface");
const order_model_1 = require("../orders/order.model");
const productDetail_model_1 = require("../porductDetail/productDetail.model");
const porduct_model_1 = require("../product/porduct.model");
const user_model_1 = require("../user/user.model");
const wishList_model_1 = require("../wishList/wishList.model");
const userMetaService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const ordersAggregation = order_model_1.orderModel.aggregate([
        { $match: { user: userId } },
        {
            $facet: {
                totalOrders: [{ $count: 'totalOrders' }],
                completedOrders: [
                    { $match: { status: order_interface_1.OrderStatus.DELIVERED } },
                    { $count: 'completedOrders' },
                ],
                totalPurchaseAmount: [
                    {
                        $match: {
                            status: order_interface_1.OrderStatus.DELIVERED,
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
                    { $match: { status: order_interface_1.OrderStatus.PENDING } },
                    { $count: 'pendingOrders' },
                ],
                returnedOrders: [
                    { $match: { status: order_interface_1.OrderStatus.RETURNED } },
                    { $count: 'returnedOrders' },
                ],
                unpaidOrders: [
                    { $match: { isPaid: false } },
                    { $count: 'unpaidOrders' },
                ],
                paidOrders: [{ $match: { isPaid: true } }, { $count: 'paidOrders' }],
                canceledOrders: [
                    { $match: { status: order_interface_1.OrderStatus.CANCELED } },
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
    const wishlistCount = wishList_model_1.wishListModel.countDocuments({ user: userId });
    const cartCount = cart_model_1.cartModel.countDocuments({ user: userId });
    const [orderCount, totalWishListItem, totalCartItem] = yield Promise.all([
        ordersAggregation,
        wishlistCount,
        cartCount,
    ]);
    const orderStats = orderCount[0];
    const result = [
        { title: 'Total Orders', value: orderStats === null || orderStats === void 0 ? void 0 : orderStats.totalOrders },
        { title: 'Completed Orders', value: orderStats === null || orderStats === void 0 ? void 0 : orderStats.totalCompletedOrders },
        { title: 'Pending Orders', value: orderStats === null || orderStats === void 0 ? void 0 : orderStats.totalPendingOrders },
        { title: 'Canceled Orders', value: orderStats === null || orderStats === void 0 ? void 0 : orderStats.totalCancelOrder },
        { title: 'Returned Orders', value: orderStats === null || orderStats === void 0 ? void 0 : orderStats.totalReturnedOrders },
        { title: 'Paid Orders', value: orderStats === null || orderStats === void 0 ? void 0 : orderStats.totalPaidOrder },
        { title: 'Unpaid Orders', value: orderStats === null || orderStats === void 0 ? void 0 : orderStats.totalUnpaid },
        { title: 'Total Purchase Amount', value: orderStats === null || orderStats === void 0 ? void 0 : orderStats.totalPurchaseAmount },
        { title: 'Total Wishlist Items', value: totalWishListItem },
        { title: 'Total Cart Items', value: totalCartItem },
    ];
    return result;
});
const adminMetaDataService = () => __awaiter(void 0, void 0, void 0, function* () {
    const [usersAggregation, productsAggregation, productDetailsAggregation, ordersAggregation,] = yield Promise.all([
        user_model_1.userModel.aggregate([
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
        porduct_model_1.productModel.aggregate([
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
        productDetail_model_1.productDetailModel.aggregate([
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
        order_model_1.orderModel.aggregate([
            {
                $facet: {
                    total: [{ $count: 'total' }],
                    pending: [
                        { $match: { status: order_interface_1.OrderStatus.PENDING } },
                        { $count: 'total' },
                    ],
                    paid: [{ $match: { status: order_interface_1.OrderStatus.PAID } }, { $count: 'total' }],
                    processing: [
                        { $match: { status: order_interface_1.OrderStatus.PROCESSING } },
                        { $count: 'total' },
                    ],
                    shifted: [
                        { $match: { status: order_interface_1.OrderStatus.SHIPPED } },
                        { $count: 'total' },
                    ],
                    delivered: [
                        { $match: { status: order_interface_1.OrderStatus.DELIVERED } },
                        { $count: 'total' },
                    ],
                    returned: [
                        { $match: { status: order_interface_1.OrderStatus.RETURNED } },
                        { $count: 'total' },
                    ],
                    canceled: [
                        { $match: { status: order_interface_1.OrderStatus.CANCELED } },
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
});
exports.metaService = {
    userMetaService,
    adminMetaDataService,
};
