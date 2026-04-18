import httpStatus from 'http-status';
import { Plant } from '../../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import ApiError from '../../../error/ApiError';

/**
 * Register a new plant in the system
 */
const createPlant = async (userId: string, data: Plant): Promise<Plant> => {
  return await prisma.plant.create({
    data: {
      ...data,
      userId,
      plantedAt: new Date(data.plantedAt),
      harvestAt: data.harvestAt ? new Date(data.harvestAt) : null,
    },
  });
};

/**
 * Updates plant health and creates an update log
 */
const updatePlantHealth = async (
  plantId: string,
  payload: { updateMsg: string; health: string; growthStage?: string },
) => {
  return await prisma.$transaction(async tx => {
    // Check if plant exists
    const isExist = await tx.plant.findUnique({ where: { id: plantId } });
    if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, 'Plant not found');

    // Update the main Plant status
    const updatedPlant = await tx.plant.update({
      where: { id: plantId },
      data: {
        healthStatus: payload.health,
        growthStage: payload.growthStage || isExist.growthStage,
      },
    });

    // Create a record in PlantUpdate history
    await tx.plantUpdate.create({
      data: {
        plantId,
        updateMsg: payload.updateMsg,
        health: payload.health,
      },
    });

    return updatedPlant;
  });
};

/**
 * Get plant details with full update history
 */
const getPlantWithHistory = async (id: string) => {
  return await prisma.plant.findUnique({
    where: { id },
    include: {
      plantUpdates: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

export const PlantService = {
  createPlant,
  updatePlantHealth,
  getPlantWithHistory,
};
