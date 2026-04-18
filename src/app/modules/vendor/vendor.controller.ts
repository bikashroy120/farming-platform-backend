import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { vendorServices } from './vendor.services';
import { sendResponse } from '../../../shared/customResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';

const createVendor = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.user?.id as string;
  const result = await vendorServices.createVendor(data, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor create successfully',
    data: result,
  });
});

const getVendors = catchAsync(async (req: Request, res: Response) => {
  // Extraction with consistent naming
  const filters = pick(req.query, [
    'searchTerm',
    'certificationStatus',
    'latitude',
    'longitude',
    'radius',
  ]);
  const options = pick(req.query, paginationFields);
  const result = await vendorServices.getVendors(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor retrieved successfully',
    data: result,
  });
});

const getSingleVendor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await vendorServices.getSingleVendor(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor get successfully',
    data: result,
  });
});

const updateVendor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await vendorServices.updateVendor(id as string, data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor updated successfully',
    data: result,
  });
});

const deleteVendor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await vendorServices.deleteVendor(id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor deleted successfully',
    data: result,
  });
});

export const vendorController = {
  createVendor,
  getVendors,
  getSingleVendor,
  updateVendor,
  deleteVendor,
};
