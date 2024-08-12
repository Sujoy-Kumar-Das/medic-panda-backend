import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/user/user.routes';

// express router
const router = Router();

// applications routes array
const modulesRoutes = [
  { path: '/api/v1/user', route: userRoutes },
  { path: '/api/v1/auth', route: authRoutes },
];

modulesRoutes.map((route) => router.use(route.path, route.route));

export default router;
