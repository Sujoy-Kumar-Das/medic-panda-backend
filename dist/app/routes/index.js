"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_routes_1 = require("../modules/admin/admin.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const cart_routes_1 = require("../modules/cart/cart.routes");
const category_routes_1 = require("../modules/category/category.routes");
const customer_routes_1 = require("../modules/customer/customer.routes");
const manufacturer_routes_1 = require("../modules/manufacturer/manufacturer.routes");
const meta_routes_1 = require("../modules/meta/meta.routes");
const order_routes_1 = require("../modules/orders/order.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const porduct_routes_1 = require("../modules/product/porduct.routes");
const reviewReply_routes_1 = require("../modules/review-reply/reviewReply.routes");
const review_routes_1 = require("../modules/reviews/review.routes");
const user_routes_1 = require("../modules/user/user.routes");
const wishList_routes_1 = require("../modules/wishList/wishList.routes");
// express router
const router = (0, express_1.Router)();
// applications routes array
const modulesRoutes = [
    { path: '/api/v1', route: user_routes_1.userRoutes },
    { path: '/api/v1/customer', route: customer_routes_1.customerRoutes },
    { path: '/api/v1/admin', route: admin_routes_1.adminRouter },
    { path: '/api/v1/auth', route: auth_routes_1.authRoutes },
    { path: '/api/v1/', route: category_routes_1.categoryRoutes },
    { path: '/api/v1/', route: porduct_routes_1.productRoutes },
    { path: '/api/v1/', route: order_routes_1.orderRoutes },
    { path: '/api/v1/', route: manufacturer_routes_1.manufacturerRouter },
    { path: '/api/v1/', route: payment_routes_1.paymentRouter },
    { path: '/api/v1/', route: cart_routes_1.cartRouter },
    { path: '/api/v1/', route: wishList_routes_1.wishListRouter },
    { path: '/api/v1/', route: meta_routes_1.metaRouter },
    { path: '/api/v1/', route: review_routes_1.reviewRouter },
    { path: '/api/v1/', route: reviewReply_routes_1.replyRouter },
];
modulesRoutes.map((route) => router.use(route.path, route.route));
exports.default = router;
