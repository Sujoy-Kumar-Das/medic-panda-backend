import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { replyController } from './reviewReply.controller';
import { replyValidationSchema } from './reviewReply.validateSchema';

const router = Router();

router.post(
  '/review/reply/:reviewId',
  validateRequest(replyValidationSchema.addReply),
  auth(USER_ROLE.user),
  replyController.addReplyController,
);

router.get('/review/reply/:reviewId', replyController.getAllReplyController);

router.delete(
  '/review/reply/:reviewId',
  auth(USER_ROLE.user),
  replyController.deleteReplyController,
);

export const replyRouter = router;
