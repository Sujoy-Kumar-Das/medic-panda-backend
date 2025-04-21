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

// get products all reviews;
router.get('/review/:productId', reviewController.getAllReviewController);

// get the review details data;
router.get(
  '/review-details/:reviewId',
  reviewController.getReviewDetailsController,
);

router.patch(
  '/review/:reviewId',
  validateRequest(reviewValidationSchema.editReview),
  auth(USER_ROLE.user),
  reviewController.editReviewController,
);

router.delete(
  '/review/:productId',
  auth(USER_ROLE.user),
  reviewController.deleteReviewController,
);

export const reviewRouter = router;
