import { Router } from 'express';
import { reviewController } from './review.controller';

const router = Router();

router.get('/review', reviewController.getAllReviewController);

router.post('/review', reviewController.createReviewController);

export const reviewRouter = router;
