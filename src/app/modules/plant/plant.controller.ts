import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { PlantService } from './plant.service';
import { sendResponse } from '../../../shared/customResponse';
import { emitPlantUpdate } from '../../../lib/socket';
import { getIo } from '../../../lib/socket';

const createPlant = catchAsync(async (req: Request, res: Response) => {
  const result = await PlantService.createPlant(
    req.user?.id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Plant registered successfully',
    data: result,
  });
});

const updatePlantStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PlantService.updatePlantHealth(id as string, req.body);

  emitPlantUpdate(getIo(), id as string, {
    message: 'Health updated!',
    healthStatus: result.healthStatus,
    growthStage: result.growthStage,
    updatedAt: result.updatedAt,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Plant health status updated and logged',
    data: result,
  });
});

const getPlantDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await PlantService.getPlantWithHistory(
    req.params.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Plant history retrieved successfully',
    data: result,
  });
});

export const PlantController = {
  createPlant,
  updatePlantStatus,
  getPlantDetails,
};
