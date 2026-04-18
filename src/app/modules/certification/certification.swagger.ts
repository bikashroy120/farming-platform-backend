import { z } from 'zod';
import { registry, createSuccessResponse } from '../../../lib/openapi';

export const CertificationModelSchema = registry.register(
  'SustainabilityCert',
  z.object({
    id: z.string().uuid(),
    vendorId: z.string(),
    certifyingAgency: z
      .string()
      .openapi({ example: 'Global Organic Textile Standard (GOTS)' }),
    certificationDate: z.string().openapi({ example: '2026-01-15T00:00:00Z' }),
    createdAt: z.string(),
  }),
);

export const certificationSwagger = () => {
  registry.registerPath({
    method: 'post',
    path: '/certifications',
    summary: 'Add new sustainability certification',
    tags: ['Certifications'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              vendorId: z.string(),
              certifyingAgency: z.string(),
              certificationDate: z.string().openapi({ format: 'date-time' }),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Certification added successfully',
        content: {
          'application/json': {
            schema: createSuccessResponse(CertificationModelSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/certifications/vendor/{vendorId}',
    summary: 'Get all certifications for a specific vendor',
    tags: ['Certifications'],
    parameters: [
      {
        in: 'path',
        name: 'vendorId',
        required: true,
        schema: { type: 'string' },
      },
    ],
    responses: {
      200: {
        description: 'Certifications retrieved',
        content: {
          'application/json': {
            schema: createSuccessResponse(z.array(CertificationModelSchema)),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/certifications/verify/{id}',
    summary: 'Verify a certification (Admin Only)',
    tags: ['Certifications'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
    ],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              isVerified: z.boolean().openapi({ example: true }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Certification verification status updated',
        content: {
          'application/json': {
            schema: createSuccessResponse(CertificationModelSchema),
          },
        },
      },
    },
  });
};
