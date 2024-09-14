import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { metaController } from './meta.controller';

const router = Router();

router.get(
  '/meta/user',
  auth(USER_ROLE.user),
  metaController.userMetaController,
);

export const metaRouter = router;
