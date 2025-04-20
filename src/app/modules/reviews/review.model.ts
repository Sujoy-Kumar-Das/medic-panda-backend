import { Schema, model } from 'mongoose';
import { IReply, IReview } from './review.interface';

const replySchema = new Schema<IReply>(
  {
    reply: {
      type: String,
      required: [true, 'Reply Required.'],
      min: 3,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'User Id is required.'],
    },
  },
  {
    timestamps: true,
  },
);

const reviewSchema = new Schema<IReview>(
  {
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
    replies: {
      type: [replySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const reviewModel = model<IReview>('review', reviewSchema);
