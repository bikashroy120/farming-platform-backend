import { z } from 'zod';
import {
  registry,
  createSuccessResponse,
  createPaginatedResponse,
} from '../../../lib/openapi';

export const RentalSpaceModelSchema = registry.register(
  'RentalSpace',
  z.object({
    id: z.string().uuid(),
    title: z.string().openapi({ example: 'Urban Rooftop Garden Space' }),
    description: z
      .string()
      .openapi({ example: 'Perfect 200sqft space for organic farming' }),
    price: z.number().openapi({ example: 150.0 }),
    size: z.string().openapi({ example: '200 sqft' }),
    latitude: z.number().openapi({ example: 23.8103 }),
    longitude: z.number().openapi({ example: 90.4125 }),
    isAvailable: z.boolean().openapi({ example: true }),
    vendorId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
);

export const rentalSpaceSwagger = () => {
  registry.registerPath({
    method: 'post',
    path: '/rental-spaces',
    summary: 'Create a new rental space',
    tags: ['Rental Spaces'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              price: z.number(),
              size: z.string(),
              location: z.string(),
              latitude: z.number(),
              longitude: z.number(),
              vendorId: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Space created',
        content: {
          'application/json': {
            schema: createSuccessResponse(RentalSpaceModelSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/rental-spaces',
    summary: 'Get all rental spaces',
    description: 'Filter spaces by price, availability, or location radius.',
    tags: ['Rental Spaces'],
    parameters: [
      { in: 'query', name: 'searchTerm', schema: { type: 'string' } },
      { in: 'query', name: 'minPrice', schema: { type: 'number' } },
      { in: 'query', name: 'maxPrice', schema: { type: 'number' } },
      {
        in: 'query',
        name: 'latitude',
        schema: { type: 'number' },
        description: 'Center latitude for radius search',
      },
      {
        in: 'query',
        name: 'longitude',
        schema: { type: 'number' },
        description: 'Center longitude for radius search',
      },
      {
        in: 'query',
        name: 'radius',
        schema: { type: 'number' },
        description: 'Search radius in km',
      },
      { in: 'query', name: 'isAvailable', schema: { type: 'boolean' } },
      { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
      { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createPaginatedResponse(RentalSpaceModelSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/rental-spaces/{id}',
    summary: 'Get single rental space',
    tags: ['Rental Spaces'],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createSuccessResponse(RentalSpaceModelSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/rental-spaces/{id}',
    summary: 'Update rental space',
    tags: ['Rental Spaces'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              title: z.string().optional(),
              price: z.number().optional(),
              isAvailable: z.boolean().optional(),
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
            schema: createSuccessResponse(RentalSpaceModelSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/rental-spaces/{id}',
    summary: 'Delete rental space',
    tags: ['Rental Spaces'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: {
        description: 'Deleted',
        content: {
          'application/json': {
            schema: createSuccessResponse(z.null(), 'Space deleted'),
          },
        },
      },
    },
  });
};
