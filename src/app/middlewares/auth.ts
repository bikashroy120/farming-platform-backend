import { Request, Response, NextFunction } from 'express';
import ApiError from '../../error/ApiError';
import config from '../../config';
import { verifyToken } from '../helpers/jwtHelpers';
import httpStatus from 'http-status';

const auth =
  (...requiredRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        throw new ApiError(401, 'Access Denied: No Token Provided');
      }

      const verify = verifyToken(token, config.access_token_secret as string);

      if (!verify) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Session expired. Please login again.',
        );
      }

      req.user = verify;

      if (requiredRole.length && !requiredRole.includes(verify.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Access denied: You are not authorized to perform this action',
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export const authMiddlewares = {
  auth,
};
