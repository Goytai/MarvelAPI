import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';

function errorHandlingMiddleware(
  error: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message
    });
  }
  // eslint-disable-next-line no-console
  console.log(error);

  return response.status(500).json({
    statusCode: 500,
    message: 'Internal server error'
  });
}

export default errorHandlingMiddleware;
