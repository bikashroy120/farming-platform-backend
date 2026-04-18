import { z } from 'zod';

export const createBookingZodSchema = z.object({
  body: z
    .object({
      rentalSpaceId: z.string({
        error: 'Rental Space ID is required',
      }),
      startDate: z
        .string({
          error: 'Start date is required',
        })
        .datetime({ message: 'Invalid start date format' })
        .refine(date => new Date(date) >= new Date(), {
          message: 'Start date cannot be in the past',
        }),
      endDate: z
        .string({
          error: 'End date is required',
        })
        .datetime({ message: 'Invalid end date format' }),
    })
    .refine(data => new Date(data.endDate) > new Date(data.startDate), {
      message: 'End date must be at least one day after the start date',
      path: ['endDate'],
    }),
});
