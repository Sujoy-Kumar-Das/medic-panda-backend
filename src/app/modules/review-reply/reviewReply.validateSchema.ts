import { z } from 'zod';

const addReply = z.object({
  body: z.object({
    reply: z
      .string({
        required_error: 'Reply is required',
        invalid_type_error: 'Reply must be a string',
      })
      .min(3, 'Reply must be at least 3 characters'),
  }),
});

export const replyValidationSchema = {
  addReply,
};
