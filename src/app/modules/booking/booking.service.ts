import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IBookingFilterRequest } from './booking.interface';
import { Booking, Prisma } from '../../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import ApiError from '../../../error/ApiError';
import { calculatePagination } from '../../helpers/paginationHelper';

/**
 * Create a booking using Prisma Transaction
 */
const createBooking = async (
  userId: string,
  payload: any,
): Promise<Booking> => {
  const { rentalSpaceId, startDate, endDate } = payload;

  // Transaction starts
  const result = await prisma.$transaction(async tx => {
    // Check if the space exists
    const space = await tx.rentalSpace.findUnique({
      where: { id: rentalSpaceId },
    });

    if (!space) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Rental space not found');
    }

    // Check for date overlaps in existing bookings
    const isOverlapping = await tx.booking.findFirst({
      where: {
        rentalSpaceId,
        AND: [
          { startDate: { lt: new Date(endDate) } },
          { endDate: { gt: new Date(startDate) } },
        ],
      },
    });

    if (isOverlapping) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Space already booked for these dates',
      );
    }

    // Create the booking
    const newBooking = await tx.booking.create({
      data: {
        userId,
        rentalSpaceId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      include: {
        user: true,
        rentalSpace: true,
      },
    });

    return newBooking;
  });

  return result;
};

/**
 * Get all bookings with Search, Date Filter, and Pagination
 */
const getAllBookings = async (
  filters: IBookingFilterRequest,
  options: IPaginationOptions,
) => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions: Prisma.BookingWhereInput[] = [];

  // Search logic
  if (searchTerm) {
    andConditions.push({
      OR: [
        { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
        {
          rentalSpace: {
            location: { contains: searchTerm, mode: 'insensitive' },
          },
        },
      ],
    });
  }

  // Date range filter
  if (startDate || endDate) {
    andConditions.push({
      AND: [
        startDate ? { startDate: { gte: new Date(startDate) } } : {},
        endDate ? { endDate: { lte: new Date(endDate) } } : {},
      ],
    });
  }

  // Exact filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const whereConditions: Prisma.BookingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch data and count in a single transaction
  const [result, total] = await prisma.$transaction([
    prisma.booking.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      include: { user: true, rentalSpace: true },
    }),
    prisma.booking.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit },
    data: result,
  };
};

export const BookingService = {
  createBooking,
  getAllBookings,
};
