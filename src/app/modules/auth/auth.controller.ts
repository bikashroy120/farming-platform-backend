import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { authServices } from './auth.services';
import { sendResponse } from '../../../shared/customResponse';
import httpStatus from 'http-status';
import config from '../../../config';

const register = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await authServices.registerUser(data);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Account created successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await authServices.loginUser(data);
  const { refreshToken, accessToken } = result;

  const cookieOptions = {
    httpOnly: true,
    secure: config.node_env === 'production',
    sameSite: 'strict' as const,
  };

  // Set Token in Cookie
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Login successfully',
    data: result,
  });
});

const getAccessToken = catchAsync(async (req: Request, res: Response) => {
  // get refresh token
  const { refreshToken: oldRefreshToken } = req.cookies;

  const result = await authServices.getAccessToken(oldRefreshToken);

  const { accessToken, refreshToken: newRefreshToken } = result;

  // Cookie Options
  const cookieOptions = {
    httpOnly: true,
    secure: config.node_env === 'production',
    sameSite: 'strict' as const,
  };

  // Set Token in Cookie
  res.cookie('refreshToken', newRefreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved successfully',
    data: {
      accessToken,
    },
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: config.node_env === 'production',
    sameSite: 'strict' as const,
  };

  // clear token
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged out successfully',
    data: null,
  });
});

export const authController = {
  register,
  loginUser,
  getAccessToken,
  logoutUser,
};
