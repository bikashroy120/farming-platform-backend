import { z } from 'zod';

const createPlantZodSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Plant name is required' }),
    growthStage: z.string({ error: 'Growth stage is required' }),
    healthStatus: z.string({ error: 'Health status is required' }),
    plantedAt: z.string({ error: 'Planting date is required' }).datetime(),
    harvestAt: z.string().datetime().optional(),
  }),
});

const updatePlantStatusZodSchema = z.object({
  body: z.object({
    updateMsg: z.string({ error: 'Update message is required' }),
    health: z.string({ error: 'Current health status is required' }),
    growthStage: z.string().optional(),
  }),
});

export const PlantValidation = {
  createPlantZodSchema,
  updatePlantStatusZodSchema,
};
