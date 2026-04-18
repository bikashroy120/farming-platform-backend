import { z } from 'zod';

const createRentalSpaceZodSchema = z.object({
  body: z.object({
    vendorId: z.string({ error: 'Vendor ID is required' }),
    location: z.string({ error: 'Location name is required' }),
    latitude: z.number({ error: 'Latitude is required' }),
    longitude: z.number({ error: 'Longitude is required' }),
    size: z.string({ error: 'Size description is required' }),
    price: z.number({ error: 'Price is required' }).positive(),
    isAvailable: z.boolean().optional(),
  }),
});

const updateRentalSpaceZodSchema = z.object({
  body: z.object({
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    size: z.string().optional(),
    price: z.number().positive().optional(),
    isAvailable: z.boolean().optional(),
  }),
});

export const RentalSpaceValidation = {
  createRentalSpaceZodSchema,
  updateRentalSpaceZodSchema,
};
