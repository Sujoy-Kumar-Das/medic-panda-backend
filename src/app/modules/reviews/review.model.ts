import { Schema, model } from 'mongoose';
import { IReply, IReview } from './review.interface';

const replySchema = new Schema<IReply>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User is required for reply.'],
  },
  reply: {
    type: String,
    required: [true, 'Reply is required'],
  },
});

const reviewSchema = new Schema<IReview>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  replies: [replySchema],
});

export const reviewModel = model<IReview>('review', reviewSchema);
