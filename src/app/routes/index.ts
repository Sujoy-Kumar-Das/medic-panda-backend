import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { userRoutes } from '../modules/user/user.routes';
import { variantRoutes } from '../modules/variants/variants.routes';

// express router
const router = Router();

// applications routes array
const modulesRoutes = [
  { path: '/api/v1/user', route: userRoutes },
  { path: '/api/v1/auth', route: authRoutes },
  { path: '/api/v1/', route: categoryRoutes },
  { path: '/api/v1/', route: variantRoutes },
];

modulesRoutes.map((route) => router.use(route.path, route.route));

export default router;
