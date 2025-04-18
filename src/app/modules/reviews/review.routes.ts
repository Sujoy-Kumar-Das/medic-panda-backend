import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { reviewController } from './review.controller';
import { reviewValidationSchema } from './review.validation';

const router = Router();

router.post(
  '/review',
  auth(USER_ROLE.user),
  validateRequest(reviewValidationSchema.createReview),
  reviewController.createReviewController,
);

router.get('/review/:productId', reviewController.getAllReviewController);

export const reviewRouter = router;
