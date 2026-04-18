import { IRentalSpaceFilterRequest } from './rentalSpace.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Prisma, RentalSpace } from '../../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import { calculatePagination } from '../../helpers/paginationHelper';
import { getBoundingBox } from '../../helpers/boundingBox';

/**
 * Create new Rental Space
 */
const createRentalSpace = async (data: RentalSpace): Promise<RentalSpace> => {
  return await prisma.rentalSpace.create({ data });
};

/**
 * Get all Rent space with filtering and pagination
 */
const getAllRentalSpaces = async (
  filters: IRentalSpaceFilterRequest,
  options: IPaginationOptions,
) => {
  const {
    searchTerm,
    latitude,
    longitude,
    radius,
    minPrice,
    maxPrice,
    ...filterData
  } = filters;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions = [];

  // Text Search
  if (searchTerm) {
    andConditions.push({
      OR: ['location', 'size'].map(field => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  // Location-Based Search (Radius filter)
  if (latitude && longitude && radius) {
    const { minLat, maxLat, minLon, maxLon } = getBoundingBox(
      Number(latitude),
      Number(longitude),
      Number(radius),
    );
    andConditions.push({
      latitude: { gte: minLat, lte: maxLat },
      longitude: { gte: minLon, lte: maxLon },
    });
  }

  // Price Range Filter
  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        gte: minPrice ? parseFloat(minPrice) : undefined,
        lte: maxPrice ? parseFloat(maxPrice) : undefined,
      },
    });
  }

  //  Exact match filters (e.g., isAvailable)
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals:
            (filterData as any)[key] === 'true'
              ? true
              : (filterData as any)[key] === 'false'
                ? false
                : (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.RentalSpaceWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.rentalSpace.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    include: { vendor: true },
  });

  const total = await prisma.rentalSpace.count({ where: whereConditions });

  return { meta: { total, page, limit }, data: result };
};

/**
 * Get single Rental Space by ID
 */
const getSingleRentalSpace = async (
  id: string,
): Promise<RentalSpace | null> => {
  return await prisma.rentalSpace.findUnique({
    where: { id },
    include: { vendor: true, bookings: true },
  });
};

/**
 * Update Rental Space data
 */
const updateRentalSpace = async (
  id: string,
  payload: Partial<RentalSpace>,
): Promise<RentalSpace> => {
  return await prisma.rentalSpace.update({
    where: { id },
    data: payload,
  });
};

/**
 * Delete Rental Space
 */
const deleteRentalSpace = async (id: string): Promise<RentalSpace> => {
  return await prisma.rentalSpace.delete({ where: { id } });
};

export const RentalSpaceService = {
  createRentalSpace,
  getAllRentalSpaces,
  getSingleRentalSpace,
  updateRentalSpace,
  deleteRentalSpace,
};
