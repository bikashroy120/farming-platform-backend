import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { OrderService } from './order.service';
import pick from '../../../shared/pick';
import { sendResponse } from '../../../shared/customResponse';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await OrderService.createOrder(user?.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Order placed successfully',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['status', 'startDate', 'endDate']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  // Inject the logged-in user ID into filters
  filters.userId = req.user?.id as string;

  const result = await OrderService.getAllOrders(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My orders retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getVendorOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['status', 'userId']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await OrderService.getAllOrders(filters, options);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vendor dashboard orders fetched',
    meta: result.meta,
    data: result.data,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.updateOrderStatus(
    req.params.id as string,
    req.body.status,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order status updated successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
};
