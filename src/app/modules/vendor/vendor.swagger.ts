import { z } from 'zod';
import {
  registry,
  createSuccessResponse,
  createPaginatedResponse,
} from '../../../lib/openapi';
import { CertificationStatus } from '../../../../generated/prisma/enums';

export const VendorModelSchema = registry.register(
  'Vendor',
  z.object({
    id: z.string().openapi({ example: '01ARZ3NDEKTSV4RRFFQ69G5FAV' }),
    farmName: z.string().openapi({ example: 'Green Valley Farm' }),
    farmLocation: z.string().openapi({ example: 'Dhaka, Bangladesh' }),
    latitude: z.number().openapi({ example: 23.8103 }),
    longitude: z.number().openapi({ example: 90.4125 }),
    certificationStatus: z.string().openapi({ example: 'PENDING' }),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
);

export const vendorSwagger = () => {
  registry.registerPath({
    method: 'get',
    path: '/vendors/vendor/all',
    summary: 'Get all vendors with pagination (Admin Only)',
    tags: ['Vendors'],
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: 'query',
        name: 'searchTerm',
        schema: { type: 'string' },
        description: 'Search by farm name or location',
      },
      {
        in: 'query',
        name: 'certificationStatus',
        schema: { type: 'string', enum: Object.values(CertificationStatus) },
      },
      { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
      { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
    ],
    responses: {
      200: {
        description: 'Vendors retrieved successfully',
        content: {
          'application/json': {
            schema: createPaginatedResponse(
              z.object({
                id: z.string(),
                farmName: z.string(),
                farmLocation: z.string(),
                certificationStatus: z.nativeEnum(CertificationStatus),
                userId: z.string(),
              }),
            ),
          },
        },
      },
    },
  });
  registry.registerPath({
    method: 'get',
    path: '/vendors/{id}',
    summary: 'Get single vendor details',
    tags: ['Vendors'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: {
        description: 'Vendor details retrieved',
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.object({
                id: z.string(),
                farmName: z.string(),
                farmLocation: z.string(),
                latitude: z.number(),
                longitude: z.number(),
                certificationStatus: z.nativeEnum(CertificationStatus),
                userId: z.string(),
                createdAt: z.string(),
              }),
            ),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/vendors/{id}',
    summary: 'Update vendor profile/status (Admin Only)',
    tags: ['Vendors'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              farmName: z.string().optional(),
              farmLocation: z.string().optional(),
              certificationStatus: z.nativeEnum(CertificationStatus).optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Vendor updated successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.object({ id: z.string(), farmName: z.string() }),
            ),
          },
        },
      },
    },
  });
  registry.registerPath({
    method: 'delete',
    path: '/vendors/{id}',
    summary: 'Delete a vendor profile (Admin Only)',
    tags: ['Vendors'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: {
        description: 'Vendor deleted successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(
              z.null(),
              'Vendor deleted successfully',
            ),
          },
        },
      },
    },
  });
};
