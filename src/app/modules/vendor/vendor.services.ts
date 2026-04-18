import httpStatus from 'http-status';
import {
  Prisma,
  User,
  UserStatus,
  VendorProfile,
} from '../../../../generated/prisma/client';
import ApiError from '../../../error/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../lib/prisma';
import { calculatePagination } from '../../helpers/paginationHelper';
import { IVendorFilter } from './vendor.interface';
import { getBoundingBox } from '../../helpers/boundingBox';

const createVendor = async (data: VendorProfile): Promise<VendorProfile> => {
  // Check if vendor already exists for this user
  const existingVendor = await prisma.vendorProfile.findUnique({
    where: { userId: data.userId },
  });

  if (existingVendor) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Vendor profile already exists for this user',
    );
  }

  // Create vendor profile
  const result = await prisma.vendorProfile.create({
    data: {
      farmName: data.farmName,
      farmLocation: data.farmLocation,
      latitude: data.latitude,
      longitude: data.longitude,
      userId: data.userId,
    },
  });

  return result;
};

const getVendors = async (
  filter: IVendorFilter,
  paginationOption: IPaginationOptions,
): Promise<IGenericResponse<VendorProfile[]>> => {
  const { searchTerm, latitude, longitude, radius, ...filterData } = filter;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOption);
  const andConditions = [];

  // search filter
  if (searchTerm) {
    andConditions.push({
      OR: ['farmName', 'farmLocation'].map(filed => ({
        [filed]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // location base filter
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

  if (Object.keys(filterData).length > 0) {
    // other filter
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: filterData,
        },
      })),
    });
  }

  const whereConditions: Prisma.VendorProfileWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // get user and total
  const [user, total] = await Promise.all([
    prisma.vendorProfile.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    }),

    prisma.vendorProfile.count({
      where: whereConditions,
    }),
  ]);

  // return data
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: user,
  };
};

const getSingleVendor = async (id: string): Promise<VendorProfile> => {
  const user = await prisma.vendorProfile.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor does not exist');
  }
  return user;
};

const updateVendor = async (
  id: string,
  data: Partial<VendorProfile>,
): Promise<VendorProfile> => {
  // Check if the vendor exists
  const isExist = await prisma.vendorProfile.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  }

  // update status
  const updatedUser = await prisma.vendorProfile.update({
    where: { id },
    data: {
      ...data,
    },
  });

  return updatedUser;
};

const deleteVendor = async (id: string): Promise<User> => {
  // Check if user exists
  const isExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Delete the user
  const result = await prisma.user.delete({
    where: { id },
  });

  return result;
};

export const vendorServices = {
  createVendor,
  getVendors,
  getSingleVendor,
  updateVendor,
  deleteVendor,
};
