import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../lib/prisma';
import ApiError from '../../../error/ApiError';
import { Prisma } from '../../../../generated/prisma/client';
import { calculatePagination } from '../../helpers/paginationHelper';

/**
 * Create Order with Stock Management (Transaction)
 */
const createOrder = async (
  userId: string,
  payload: { produceId: string; quantity: number },
) => {
  return await prisma.$transaction(async tx => {
    // Check if produce exists and has enough stock
    const produce = await tx.produce.findUnique({
      where: { id: payload.produceId },
    });

    if (!produce) throw new ApiError(httpStatus.NOT_FOUND, 'Produce not found');

    if (produce.availableQuantity < payload.quantity) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Insufficient stock available',
      );
    }

    // Decrease the stock quantity
    await tx.produce.update({
      where: { id: payload.produceId },
      data: {
        availableQuantity: { decrement: payload.quantity },
      },
    });

    // Create the order
    const order = await tx.order.create({
      data: {
        userId,
        produceId: payload.produceId,
        vendorId: produce.vendorId,
        status: 'PENDING',
      },
      include: { produce: true, user: true },
    });

    return order;
  });
};

/**
 * Get Orders with Pagination & Filtering
 */
const getAllOrders = async (filters: any, options: IPaginationOptions) => {
  const { searchTerm, startDate, endDate, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions: Prisma.OrderWhereInput[] = [];

  // Date Range Filtering
  if (startDate || endDate) {
    andConditions.push({
      orderDate: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({ [key]: filterData[key] })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [result, total] = await prisma.$transaction([
    prisma.order.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { orderDate: 'desc' },
      include: { user: true, produce: true },
    }),
    prisma.order.count({ where: whereConditions }),
  ]);

  return { meta: { total, page, limit }, data: result };
};

const updateOrderStatus = async (id: string, status: string) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
};

export const OrderService = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
};
