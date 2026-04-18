import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { BookingService } from './booking.service';
import pick from '../../../shared/pick';
import { sendResponse } from '../../../shared/customResponse';
import { paginationFields } from '../../../constant/pagination';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await BookingService.createBooking(
    user?.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Booking created successfully',
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    'startDate',
    'endDate',
    'userId',
    'rentalSpaceId',
  ]);
  const options = pick(req.query, paginationFields);
  const result = await BookingService.getAllBookings(filters, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const BookingController = {
  createBooking,
  getAllBookings,
};
