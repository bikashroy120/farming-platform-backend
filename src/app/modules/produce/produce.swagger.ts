import { z } from 'zod';
import {
  registry,
  createSuccessResponse,
  createPaginatedResponse,
} from '../../../lib/openapi';
import { CertificationStatus } from '../../../../generated/prisma/enums';

export const ProduceModelSchema = registry.register(
  'Produce',
  z.object({
    id: z.string().uuid(),
    vendorId: z.string(),
    name: z.string().openapi({ example: 'Organic Spinach' }),
    description: z
      .string()
      .openapi({ example: 'Fresh green spinach from urban roof garden.' }),
    price: z.number().openapi({ example: 25.5 }),
    category: z.string().openapi({ example: 'Vegetables' }),
    certificationStatus: z.nativeEnum(CertificationStatus),
    availableQuantity: z.number().openapi({ example: 100 }),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
);

export const produceSwagger = () => {
  registry.registerPath({
    method: 'post',
    path: '/produce',
    summary: 'Create new produce',
    tags: ['Produce'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string(),
              description: z.string(),
              price: z.number(),
              category: z.string(),
              availableQuantity: z.number(),
              vendorId: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Produce created successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(ProduceModelSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/produce',
    summary: 'Get all produce',
    tags: ['Produce'],
    parameters: [
      { in: 'query', name: 'searchTerm', schema: { type: 'string' } },
      { in: 'query', name: 'category', schema: { type: 'string' } },
      { in: 'query', name: 'vendorId', schema: { type: 'string' } },
      { in: 'query', name: 'minPrice', schema: { type: 'number' } },
      { in: 'query', name: 'maxPrice', schema: { type: 'number' } },
      { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
      { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createPaginatedResponse(ProduceModelSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/produce/{id}',
    summary: 'Get single produce',
    tags: ['Produce'],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessResponse(ProduceModelSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/produce/{id}',
    summary: 'Update produce',
    tags: ['Produce'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().optional(),
              price: z.number().optional(),
              availableQuantity: z.number().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Updated',
        content: {
          'application/json': {
            schema: createSuccessResponse(ProduceModelSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/produce/{id}',
    summary: 'Delete produce',
    tags: ['Produce'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: {
        description: 'Deleted',
        content: {
          'application/json': {
            schema: createSuccessResponse(z.null(), 'Produce deleted'),
          },
        },
      },
    },
  });
};
