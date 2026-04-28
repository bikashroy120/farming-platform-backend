import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { userServices } from './users.services';
import { sendResponse } from '../../../shared/customResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';
import { getKey } from '../../helpers/key';
import redisClient from '../../../lib/redis';

const getUsers = catchAsync(async (req: Request, res: Response) => {
  // Extraction with consistent naming
  const filters = pick(req.query, ['searchTerm', 'role', 'status']);
  const options = pick(req.query, paginationFields);

  const key = `users:${getKey(req.query)}`;

  const getCash = await redisClient.get(key);

  if (getCash) {
    console.log('Cache hit for key:========');
    const data = JSON.parse(getCash);
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Users retrieved successfully (from cache)',
      meta: data.meta,
      data: data.data,
    });
  }

  console.log('Cache miss for key:========');
  const result = await userServices.getUsers(filters, options);

  await redisClient.setex(key, 3600, JSON.stringify(result));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await userServices.getSingleUser(id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User get successfully',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await userServices.updateStatus(id as string, status);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User status updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.deleteUser(id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: result,
  });
});

export const userController = {
  getUsers,
  getSingleUser,
  updateUserStatus,
  deleteUser,
};
