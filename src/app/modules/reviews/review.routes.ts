import { Router } from 'express';
import { reviewController } from './review.controller';

const router = Router();

router.post('/review', reviewController.createReviewController);

export const reviewRouter = router;
