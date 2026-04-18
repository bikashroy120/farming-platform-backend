import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import { RentalSpaceService } from './rentalSpace.service';
import { sendResponse } from '../../../shared/customResponse';

const createRentalSpace = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalSpaceService.createRentalSpace(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Rental space listed successfully',
    data: result,
  });
});

const getAllRentalSpaces = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    'minPrice',
    'maxPrice',
    'latitude',
    'longitude',
    'radius',
    'isAvailable',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await RentalSpaceService.getAllRentalSpaces(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental spaces retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleRentalSpace = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalSpaceService.getSingleRentalSpace(
    req.params.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental space details fetched',
    data: result,
  });
});

const updateRentalSpace = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalSpaceService.updateRentalSpace(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental space updated successfully',
    data: result,
  });
});

const deleteRentalSpace = catchAsync(async (req: Request, res: Response) => {
  await RentalSpaceService.deleteRentalSpace(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental space removed successfully',
    data: null,
  });
});

export const RentalSpaceController = {
  createRentalSpace,
  getAllRentalSpaces,
  getSingleRentalSpace,
  updateRentalSpace,
  deleteRentalSpace,
};
