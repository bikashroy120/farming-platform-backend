import httpStatus from 'http-status';
import { Prisma, User, UserStatus } from '../../../../generated/prisma/client';
import ApiError from '../../../error/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../lib/prisma';
import { calculatePagination } from '../../helpers/paginationHelper';
import { IUserFilter } from './users.interface';

const getUsers = async (
  filter: IUserFilter,
  paginationOption: IPaginationOptions,
): Promise<IGenericResponse<User[]>> => {
  const { searchTerm, ...filterData } = filter;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOption);
  const andConditions = [];

  // search filter
  if (searchTerm) {
    andConditions.push({
      OR: ['name', 'email'].map(filed => ({
        [filed]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // other filter
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: filterData,
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // get user and total
  const [user, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
    }),

    prisma.user.count({
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

const getSingleUser = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  return user;
};

const updateStatus = async (id: string, status: UserStatus): Promise<User> => {
  // Check if the user exists
  const isExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // update status
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      status,
    },
  });

  return updatedUser;
};

const deleteUser = async (id: string): Promise<User> => {
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

export const userServices = {
  getUsers,
  getSingleUser,
  updateStatus,
  deleteUser,
};
