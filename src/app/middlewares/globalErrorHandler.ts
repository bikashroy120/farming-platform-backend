import { ErrorRequestHandler } from 'express';
import config from '../../config';
import { IGenericErrorMessage } from '../../interfaces/errorInterface';
import { ZodError } from 'zod';
import handleZodValidationError from '../../error/handleZodValidationError';
import ApiError from '../../error/ApiError';

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
