import { z } from 'zod';
import {
  registry,
  createPaginatedResponse,
  createSuccessResponse,
} from '../../../lib/openapi';
import { Role } from '../../../../generated/prisma/enums';

export const userSwagger = () => {
  registry.registerPath({
    method: 'get',
    path: '/user',
    summary: 'Get all users with pagination and filters',
    description:
      'Retrieve a list of users. Supports search by name/email, filtering by role/status, and full pagination.',
    tags: ['Users'],
    security: [{ bearerAuth: [] }],

    parameters: [
      {
        in: 'query',
        name: 'searchTerm',
        schema: { type: 'string' },
        description: 'Search by user name or email',
      },
      {
        in: 'query',
        name: 'role',
        schema: { type: 'string', enum: Object.values(Role) },
        description: 'Filter users by their role',
      },
      {
        in: 'query',
        name: 'status',
        schema: { type: 'string' },
        description: 'Filter by user status (active/blocked)',
      },
      {
        in: 'query',
        name: 'page',
        schema: { type: 'integer', default: 1 },
      },
      {
        in: 'query',
        name: 'limit',
        schema: { type: 'integer', default: 10 },
      },
      {
        in: 'query',
        name: 'sortBy',
        schema: { type: 'string' },
      },
      {
        in: 'query',
        name: 'sortOrder',
        schema: { type: 'string', enum: ['asc', 'desc'] },
      },
    ],

    responses: {
      200: {
        description: 'Users retrieved successfully',
        content: {
          'application/json': {
            schema: createPaginatedResponse(
              z.object({
                id: z.string(),
                name: z.string(),
                email: z.string().email(),
                role: z.nativeEnum(Role),
                status: z.string(),
                createdAt: z.string(),
              }),
            ),
          },
        },
      },
    },
  });
  registry.registerPath({
    method: 'get',
    path: '/user/{id}',
    summary: 'Get a single user by ID',
    tags: ['Users'],
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string' },
        description: 'User Unique ID',
      },
    ],
    responses: {
      200: {
        description: 'User retrieved successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                role: z.string(),
              }),
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/user/{id}',
    summary: 'Update user status (Admin Only)',
    description:
      'Allows an administrator to change user status (e.g., active, blocked).',
    tags: ['Users'],
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string' },
      },
    ],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              status: z
                .enum(['ACTIVE', 'BLOCKED'])
                .openapi({ example: 'BLOCKED' }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User status updated successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.object({ id: z.string(), status: z.string() }),
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/user/{id}',
    summary: 'Delete a user (Admin Only)',
    tags: ['Users'],
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string' },
      },
    ],
    responses: {
      200: {
        description: 'User deleted successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.null(),
              'User deleted successfully',
            ),
          },
        },
      },
    },
  });
};
