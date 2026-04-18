import { z } from 'zod';
import { registry, createSuccessResponse } from '../../../lib/openapi';
import { loginSchema, registerSchema } from './auth.validations';

export const authSwagger = () => {
  registry.registerPath({
    method: 'post',
    path: '/auth/register',
    summary: 'Register a new user',
    description:
      'Creates a new account and returns the user profile along with authentication tokens.',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: registerSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Account created successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.object({
                user: z.object({
                  id: z.string(),
                  name: z.string(),
                  email: z.string().email(),
                  role: z.string(),
                  createdAt: z.string(),
                  updatedAt: z.string(),
                }),
              }),
              'Account created successfully',
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/login',
    summary: 'User Login',
    tags: ['Auth'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginSchema.shape.body,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.object({
                user: z.object({
                  id: z.string(),
                  name: z.string(),
                  email: z.string().email(),
                  role: z.string(),
                }),
                accessToken: z.string(),
                refreshToken: z.string(),
              }),
              'Login successful',
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/auth/access-token',
    summary: 'Refresh Access Token',
    description: `
      This endpoint extracts the **refreshToken** from the browser cookies. 
      It generates a new **accessToken** and a new **refreshToken**, 
      then updates them in the cookies automatically.
    `,
    tags: ['Auth'],
    parameters: [
      {
        in: 'cookie',
        name: 'refreshToken',
        required: true,
        schema: { type: 'string' },
        description: 'The valid refresh token stored in cookies.',
      },
    ],
    responses: {
      200: {
        description: 'Access token retrieved successfully and cookies updated.',
        headers: {
          'Set-Cookie': {
            description: 'Updates refreshToken and accessToken in cookies.',
            schema: { type: 'string' },
          },
        },
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.object({
                accessToken: z
                  .string()
                  .openapi({ description: 'New access token' }),
              }),
              'Access token retrieved successfully',
            ),
          },
        },
      },
      401: {
        description: 'Unauthorized - Invalid or expired refresh token',
      },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/logout',
    summary: 'Logout User',
    description:
      'Clears the authentication tokens (accessToken and refreshToken) from the browser cookies.',
    tags: ['Auth'],
    responses: {
      200: {
        description: 'User logged out successfully and cookies cleared.',
        headers: {
          'Set-Cookie': {
            description:
              'Expiring the cookies to remove them from the browser.',
            schema: { type: 'string' },
          },
        },
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.null(),
              'User logged out successfully',
            ),
          },
        },
      },
    },
  });
};
