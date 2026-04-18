import { z } from 'zod';
import {
  registry,
  createSuccessResponse,
  createPaginatedResponse,
} from '../../../lib/openapi';

const UserInBookingSchema = z.object({
  id: z.string(),
  name: z.string().openapi({ example: 'Bikash Chandra' }),
  email: z.string().email(),
});

const RentalSpaceInBookingSchema = z.object({
  id: z.string(),
  title: z.string().openapi({ example: 'Rooftop Garden Section A' }),
  price: z.number().openapi({ example: 120.0 }),
  size: z.string().openapi({ example: '150 sqft' }),
});

export const BookingWithDetailsSchema = registry.register(
  'BookingWithDetails',
  z.object({
    id: z.string().uuid(),
    userId: z.string(),
    rentalSpaceId: z.string(),
    startDate: z.string().openapi({ example: '2026-05-01T10:00:00Z' }),
    endDate: z.string().openapi({ example: '2026-05-10T10:00:00Z' }),
    createdAt: z.string(),
    // Prisma include ডাটা
    user: UserInBookingSchema,
    rentalSpace: RentalSpaceInBookingSchema,
  }),
);

export const bookingSwagger = () => {
  registry.registerPath({
    method: 'post',
    path: '/bookings/create-booking',
    summary: 'Create a new rental space booking',
    tags: ['Bookings'],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              rentalSpaceId: z.string(),
              startDate: z.string().openapi({ format: 'date-time' }),
              endDate: z.string().openapi({ format: 'date-time' }),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Booking successful',
        content: {
          'application/json': {
            schema: createSuccessResponse(BookingWithDetailsSchema),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/bookings',
    summary: 'Get all bookings with filters',
    description:
      'Retrieve bookings with details. Supports filtering by dates and IDs.',
    tags: ['Bookings'],
    security: [{ bearerAuth: [] }],
    parameters: [
      { in: 'query', name: 'searchTerm', schema: { type: 'string' } },
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
      { in: 'query', name: 'userId', schema: { type: 'string' } },
      { in: 'query', name: 'rentalSpaceId', schema: { type: 'string' } },
      { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
      { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: createPaginatedResponse(BookingWithDetailsSchema),
          },
        },
      },
    },
  });
};
