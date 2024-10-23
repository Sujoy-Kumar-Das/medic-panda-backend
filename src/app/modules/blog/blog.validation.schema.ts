import { z } from 'zod';

const CommentSchema = z.object({
  commenter: z.string().min(5, { message: 'Commenter ID is required.' }),
  comment: z.string().min(5, { message: 'Comment text is required.' }),
});

// Blog Schema
const BlogSchema = z.object({
  name: z.string().min(5, { message: 'Blog name is required.' }),
  description: z.string().min(5, { message: 'Blog description is required.' }),
  thumbnail: z.string().url({ message: 'Thumbnail must be a valid URL.' }),
  author: z.string().min(5, { message: 'Author ID is required.' }),
  comments: z.array(CommentSchema).optional().default([]),
});

// Export the schemas
export { BlogSchema, CommentSchema };
