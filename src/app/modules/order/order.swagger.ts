import { z } from 'zod';
import {
  registry,
  createSuccessResponse,
  createPaginatedResponse,
} from '../../../lib/openapi';

const UserInOrderSchema = z.object({
  id: z.string(),
  name: z.string().openapi({ example: 'Bikash Chandra' }),
  email: z.string().email(),
});

const ProduceInOrderSchema = z.object({
  id: z.string(),
  name: z.string().openapi({ example: 'Organic Spinach' }),
  price: z.number().openapi({ example: 25.5 }),
  category: z.string().openapi({ example: 'Vegetables' }),
});

export const OrderWithDetailsSchema = registry.register(
  'OrderWithDetails',
  z.object({
    id: z.string().uuid(),
    userId: z.string(),
    produceId: z.string(),
    vendorId: z.string(),
    status: z.string().openapi({ example: 'PENDING' }),
    orderDate: z.string(),
    user: UserInOrderSchema,
    produce: ProduceInOrderSchema,
  }),
);

export const orderSwagger = () => {
  registry.registerPath({
    method: 'post',
    path: '/orders',
    summary: 'Place a new order',
    tags: ['Orders'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              produceId: z.string(),
              vendorId: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Order placed successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(OrderWithDetailsSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/orders/my-orders',
    summary: 'Get my orders',
    tags: ['Orders'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'query', name: 'status', schema: { type: 'string' } },
      {
        in: 'query',
        name: 'startDate',
        schema: { type: 'string', format: 'date' },
      },
      {
        in: 'query',
        name: 'endDate',
        schema: { type: 'string', format: 'date' },
      },
      { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
      { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createPaginatedResponse(OrderWithDetailsSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/orders/vendor-dashboard',
    summary: 'Get orders for vendor dashboard',
    tags: ['Orders'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'query', name: 'status', schema: { type: 'string' } },
      { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
      { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createPaginatedResponse(OrderWithDetailsSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/orders/{id}/status',
    summary: 'Update order status',
    tags: ['Orders'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              status: z.enum([
                'PENDING',
                'PROCESSING',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED',
              ]),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Order status updated',
        content: {
          'application/json': {
            schema: createSuccessResponse(OrderWithDetailsSchema),
          },
        },
      },
    },
  });
};
