import { z } from 'zod';
import {
  registry,
  createSuccessResponse,
  createPaginatedResponse,
} from '../../../lib/openapi';

const UserInPostSchema = z.object({
  id: z.string(),
  name: z.string().openapi({ example: 'Bikash Chandra' }),
  email: z.string().email(),
});

export const PostWithDetailsSchema = registry.register(
  'CommunityPost',
  z.object({
    id: z.string().uuid(),
    userId: z.string(),
    postContent: z.string().openapi({
      example: 'Looking for organic fertilizer tips for my rooftop garden!',
    }),
    postDate: z.string(),
    user: UserInPostSchema,
  }),
);

export const postSwagger = () => {
  registry.registerPath({
    method: 'post',
    path: '/community-posts',
    summary: 'Create a community post',
    tags: ['Community Posts'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              postContent: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Post created successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(PostWithDetailsSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/community-posts',
    summary: 'Get all community posts',
    tags: ['Community Posts'],
    parameters: [
      {
        in: 'query',
        name: 'searchTerm',
        schema: { type: 'string' },
        description: 'Search in post content',
      },
      {
        in: 'query',
        name: 'userId',
        schema: { type: 'string' },
        description: 'Filter by specific user',
      },
      { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
      { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
    ],
    responses: {
      200: {
        description: 'Posts retrieved successfully',
        content: {
          'application/json': {
            schema: createPaginatedResponse(PostWithDetailsSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/community-posts/{id}',
    summary: 'Get a single post',
    tags: ['Community Posts'],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessResponse(PostWithDetailsSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/community-posts/{id}',
    summary: 'Delete a post',
    tags: ['Community Posts'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: {
        description: 'Post deleted',
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.null(),
              'Post deleted successfully',
            ),
          },
        },
      },
    },
  });
};
