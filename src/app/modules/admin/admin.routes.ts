import { Router } from 'express';
import { adminController } from './admin.controller';

const router = Router();

router.patch('/', adminController.updateAdminInfo);

export const adminRouter = router;
