import { Role } from '../../../../generated/prisma/enums';
import ApiError from '../../../error/ApiError';
import { prisma } from '../../../lib/prisma';
import { comparePassword, hashPassword } from '../../helpers/bcrypt';
import { ILogin, IRegister } from './auth.interface';
import { createToken, verifyToken } from '../../helpers/jwtHelpers';
import config from '../../../config';
import httpStatus from 'http-status';

const registerUser = async (data: IRegister) => {
  // Check if user already exists
  const exitsUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (exitsUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User with this email already exists',
    );
  }

  //  Hash the password
  const hash = await hashPassword(data.password);

  // Create the user
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hash,
      role: data.role as Role,
    },
  });
  // @ts-ignore
  delete user.password;
  return user;
};

const loginUser = async (data: ILogin) => {
  // 1. Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true, password: true, email: true, role: true, name: true },
  });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Compare Password
  const isPasswordMatched = await comparePassword(data.password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Prepare JWT Payload
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // Generate Tokens
  const accessToken = createToken(payload, config.access_token_secret, '10m');
  const refreshToken = createToken(payload, config.refresh_token_secret, '7d');

  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const getAccessToken = async (
  token: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  // Check if token exists
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }

  // Verify the refresh token
  let verifiedUser;
  try {
    verifiedUser = verifyToken(token, config.refresh_token_secret);
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Refresh token is invalid or expired',
    );
  }

  // Prepare payload
  const payload = {
    id: verifiedUser.id,
    email: verifiedUser.email,
    role: verifiedUser.role,
  };

  // Generate New Tokens
  const accessToken = createToken(payload, config.access_token_secret, '10m');
  const refreshToken = createToken(payload, config.refresh_token_secret, '7d');

  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

export const authServices = {
  registerUser,
  loginUser,
  getAccessToken,
  getMe,
};
