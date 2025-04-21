import { model, Schema } from 'mongoose';
import { IReply } from './reviewReply.interface';

const replySchema = new Schema<IReply>(
  {
    review: {
      type: Schema.Types.ObjectId,
      ref: 'review',
      required: [true, 'Review ID is required.'],
    },
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

export const replyModel = model<IReply>('reply', replySchema);
