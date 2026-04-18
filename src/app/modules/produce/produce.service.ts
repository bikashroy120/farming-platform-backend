import { IProduceFilterRequest } from './produce.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Prisma, Produce } from '../../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import { calculatePagination } from '../../helpers/paginationHelper';

/**
 * Create new produce
 */
const createProduce = async (data: Produce): Promise<Produce> => {
  const result = await prisma.produce.create({
    data: { ...data },
    include: { vendor: true },
  });
  return result;
};

/**
 * Get all produce with filtering and pagination
 */
const getAllProduce = async (
  filters: IProduceFilterRequest,
  options: IPaginationOptions,
) => {
  const { searchTerm, minPrice, maxPrice, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions = [];

  // Search logic
  if (searchTerm) {
    andConditions.push({
      OR: ['name', 'category', 'description'].map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  // Price range filtering
  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        gte: minPrice ? parseFloat(minPrice) : undefined,
        lte: maxPrice ? parseFloat(maxPrice) : undefined,
      },
    });
  }

  // Exact match filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: { equals: (filterData as any)[key] },
      })),
    });
  }

  const whereConditions: Prisma.ProduceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.produce.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
  });

  const total = await prisma.produce.count({ where: whereConditions });

  return { meta: { total, page, limit }, data: result };
};

/**
 * Get single produce by ID
 */
const getSingleProduce = async (id: string): Promise<Produce | null> => {
  return await prisma.produce.findUnique({
    where: { id },
    include: { vendor: true },
  });
};

/**
 * Update produce data
 */
const updateProduce = async (
  id: string,
  payload: Partial<Produce>,
): Promise<Produce> => {
  return await prisma.produce.update({
    where: { id },
    data: payload,
  });
};

/**
 * Delete produce
 */
const deleteProduce = async (id: string): Promise<Produce> => {
  return await prisma.produce.delete({
    where: { id },
  });
};

export const ProduceService = {
  createProduce,
  getAllProduce,
  getSingleProduce,
  updateProduce,
  deleteProduce,
};
