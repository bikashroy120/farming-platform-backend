import { z } from 'zod';

const createOrderZodSchema = z.object({
  body: z.object({
    produceId: z.string({ error: 'Produce ID is required' }),
    quantity: z.number({ error: 'Quantity is required' }).positive().int(),
  }),
});

const updateOrderStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const, {
      error: 'Valid status is required',
    }),
  }),
});

export const OrderValidation = {
  createOrderZodSchema,
  updateOrderStatusZodSchema,
};
