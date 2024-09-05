import { Router } from 'express';
import { adminController } from './admin.controller';

const router = Router();

router.get('/', adminController.getAllAdminController);

export const adminRouter = router;
