import { Schema, model } from 'mongoose';
import { IBlog, IComment } from './blog.interface';

// Comment Schema
const CommentSchema = new Schema<IComment>({
  commenter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Commenter is required.'],
  },
  comment: {
    type: String,
    required: [true, 'Comment text is required.'],
  },
});

// Blog Schema
const BlogSchema = new Schema<IBlog>({
  name: {
    type: String,
    required: [true, 'Blog name is required.'],
  },
  description: {
    type: String,
    required: [true, 'Blog description is required.'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail image URL is required.'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required.'],
  },
  comments: {
    type: [CommentSchema],
    default: [],
  },
});

// Blog Model
const blogModel = model<IBlog>('Blog', BlogSchema);

export default blogModel;
