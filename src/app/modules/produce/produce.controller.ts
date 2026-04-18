import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { ProduceService } from './produce.service';
import pick from '../../../shared/pick';
import { sendResponse } from '../../../shared/customResponse';

const createProduce = catchAsync(async (req: Request, res: Response) => {
  const result = await ProduceService.createProduce(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Produce created successfully',
    data: result,
  });
});

const getAllProduce = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    'category',
    'vendorId',
    'minPrice',
    'maxPrice',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await ProduceService.getAllProduce(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All produce retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProduce = catchAsync(async (req: Request, res: Response) => {
  const result = await ProduceService.getSingleProduce(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Produce fetched successfully',
    data: result,
  });
});

const updateProduce = catchAsync(async (req: Request, res: Response) => {
  const result = await ProduceService.updateProduce(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Produce updated successfully',
    data: result,
  });
});

const deleteProduce = catchAsync(async (req: Request, res: Response) => {
  await ProduceService.deleteProduce(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Produce deleted successfully',
    data: null,
  });
});

export const ProduceController = {
  createProduce,
  getAllProduce,
  getSingleProduce,
  updateProduce,
  deleteProduce,
};
