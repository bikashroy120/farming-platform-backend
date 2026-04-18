import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorMessage } from '../../src/interfaces/errorInterface';
import { IGenericErrorResponse } from '../../src/interfaces/common';

const handleZodValidationError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1] as string,
      message: issue.message,
    };
  });

  const combinedMessage = error.issues.map(issue => issue.message).join(',');
  const statusCode = 400;

  return {
    success: false,
    statusCode,
    message: combinedMessage,
    errorMessages: errors,
  };
};

export default handleZodValidationError;
