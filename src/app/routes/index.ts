import { Router } from 'express';
import { customerServiceRouter } from '../modules/customer/customer.routes';

// express router
const router = Router();

// applications routes array
const modulesRoutes = [{ path: '/api/v1', route: customerServiceRouter }];

modulesRoutes.map((route) => router.use(route.path, route.route));

export default router;
