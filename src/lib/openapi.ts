import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

/**
 * Pagination Meta Data Schema
 */
export const metaSchema = z.object({
  total: z.number().openapi({ example: 100 }),
  page: z.number().openapi({ example: 1 }),
  limit: z.number().openapi({ example: 10 }),
});

/**
 * Standard Success Response
 */
export const createSuccessResponse = (
  dataSchema: z.ZodTypeAny,
  message: string = 'Success',
) => {
  return z.object({
    success: z.boolean().openapi({ example: true }),
    statusCode: z.number().openapi({ example: 200 }),
    message: z.string().openapi({ example: message }),
    data: dataSchema,
  });
};

/**
 * Paginated Success Response
 * Use this for list endpoints (e.g., getAllUsers, getAllPlants)
 */
export const createPaginatedResponse = (
  dataSchema: z.ZodTypeAny,
  message: string = 'Success',
) => {
  return z.object({
    success: z.boolean().openapi({ example: true }),
    statusCode: z.number().openapi({ example: 200 }),
    message: z.string().openapi({ example: message }),
    meta: metaSchema,
    data: z.array(dataSchema), // ডাটাকে অ্যারে হিসেবে রিটার্ন করবে
  });
};

export const createErrorResponse = (message: string, statusCode: number) => {
  return z.object({
    success: z.boolean().openapi({ example: false }),
    statusCode: z.number().openapi({ example: statusCode }),
    message: z.string().openapi({ example: message }),
    errorMessages: z
      .array(
        z.object({
          path: z.string(),
          message: z.string(),
        }),
      )
      .optional(),
  });
};

export function generateOpenApiDocs() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Urban Farming API',
      description:
        'Comprehensive API documentation for Urban Farming & Marketplace platform.',
      contact: {
        name: 'Bikash Chandra',
        email: 'developer@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Local Development Server',
      },
    ],
  });
}
