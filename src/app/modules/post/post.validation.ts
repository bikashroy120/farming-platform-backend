import { z } from 'zod';

const createPostZodSchema = z.object({
  body: z.object({
    postContent: z
      .string({
        error: 'Post content is required',
      })
      .min(1, 'Content cannot be empty')
      .max(1000, 'Post is too long'),
  }),
});

export const PostValidation = {
  createPostZodSchema,
};
