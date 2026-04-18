import { IPostFilterRequest } from './post.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { CommunityPost, Prisma } from '../../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import { calculatePagination } from '../../helpers/paginationHelper';

/**
 * Create a community post
 */
const createPost = async (
  userId: string,
  data: Partial<CommunityPost>,
): Promise<CommunityPost> => {
  return await prisma.$transaction(async tx => {
    const result = await tx.communityPost.create({
      data: {
        userId,
        postContent: data.postContent as string,
      },
      include: {
        user: true,
      },
    });
    return result;
  });
};

/**
 * Get all posts with Pagination and Search
 */
const getAllPosts = async (
  filters: IPostFilterRequest,
  options: IPaginationOptions,
) => {
  const { searchTerm, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions: Prisma.CommunityPostWhereInput[] = [];

  // Search filter
  if (searchTerm) {
    andConditions.push({
      postContent: {
        contains: searchTerm,
        mode: 'insensitive',
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

  const whereConditions: Prisma.CommunityPostWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // get data
  const [result, total] = await prisma.$transaction([
    prisma.communityPost.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { postDate: 'desc' },
      include: { user: true },
    }),
    prisma.communityPost.count({ where: whereConditions }),
  ]);

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getSinglePost = async (id: string): Promise<CommunityPost | null> => {
  return await prisma.communityPost.findUnique({
    where: { id },
    include: { user: true },
  });
};

const deletePost = async (
  id: string,
  userId: string,
): Promise<CommunityPost> => {
  // Ensure the user owns the post before deleting
  return await prisma.communityPost.delete({
    where: {
      id,
      userId,
    },
  });
};

export const PostService = {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
};
