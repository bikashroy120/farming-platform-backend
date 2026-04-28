import { ErrorRequestHandler } from 'express';
import config from '../../config';
import { IGenericErrorMessage } from '../../interfaces/errorInterface';
import { ZodError } from 'zod';
import handleZodValidationError from '../../error/handleZodValidationError';
import ApiError from '../../error/ApiError';
import { Prisma } from '../../../generated/prisma/client';
import handlePrismaClientKnownRequestError from '../../error/handlePrismaClientKnownRequestError';
import handlePrismaValidationError from '../../error/handlePrismaValidationError';
import { TokenExpiredError } from 'jsonwebtoken';

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (config.node_env === 'development') {
    console.log(error);
  }

  const status = false;
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodValidationError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Unauthorized! Your token has expired. Please login again.';
    errorMessages = [
      {
        path: '',
        message: error.message,
      },
    ];
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid Token!';
    errorMessages = [
      { path: '', message: 'The token you provided is not valid.' },
    ];
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handlePrismaValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = [{ message: error.message, path: '' }];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = [{ message: error.message, path: '' }];
  }

  res.status(statusCode).json({
    status,
    message,
    errorMessages,
    stack: config.node_env === 'development' ? error.stack : '',
  });
};

export default globalErrorHandler;
