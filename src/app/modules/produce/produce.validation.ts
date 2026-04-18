import { z } from 'zod';

const createProduceZodSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Name is required' }),
    description: z.string({ error: 'Description is required' }),
    price: z.number({ error: 'Price is required' }).positive(),
    category: z.string({ error: 'Category is required' }),
    vendorId: z.string({ error: 'Vendor ID is required' }),
    availableQuantity: z.number({ error: 'Quantity is required' }).int(),
  }),
});

const updateProduceZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    category: z.string().optional(),
    availableQuantity: z.number().int().optional(),
  }),
});

export const ProduceValidation = {
  createProduceZodSchema,
  updateProduceZodSchema,
};
