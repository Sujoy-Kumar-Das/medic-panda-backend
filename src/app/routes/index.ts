import { Router } from 'express';
import { adminRouter } from '../modules/admin/admin.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { cartRouter } from '../modules/cart/cart.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { customerRoutes } from '../modules/customer/customer.routes';
import { manufacturerRouter } from '../modules/manufacturer/manufacturer.routes';
import { metaRouter } from '../modules/meta/meta.routes';
import { orderRoutes } from '../modules/orders/order.routes';
import { paymentRouter } from '../modules/payment/payment.routes';
import { productRoutes } from '../modules/product/porduct.routes';
import { reviewRouter } from '../modules/reviews/review.routes';
import { userRoutes } from '../modules/user/user.routes';
import { wishListRouter } from '../modules/wishList/wishList.routes';

// express router
const router = Router();

// applications routes array
const modulesRoutes = [
  { path: '/api/v1', route: userRoutes },
  { path: '/api/v1/customer', route: customerRoutes },
  { path: '/api/v1/admin', route: adminRouter },
  { path: '/api/v1/auth', route: authRoutes },
  { path: '/api/v1/', route: categoryRoutes },
  { path: '/api/v1/', route: productRoutes },
  { path: '/api/v1/', route: orderRoutes },
  { path: '/api/v1/', route: manufacturerRouter },
  { path: '/api/v1/', route: paymentRouter },
  { path: '/api/v1/', route: cartRouter },
  { path: '/api/v1/', route: wishListRouter },
  { path: '/api/v1/', route: metaRouter },
  { path: '/api/v1/', route: reviewRouter },
];

modulesRoutes.map((route) => router.use(route.path, route.route));

export default router;
