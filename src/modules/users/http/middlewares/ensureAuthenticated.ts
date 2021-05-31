import * as Express from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import configApp from '@config/app';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Request {
    user: {
      id: number;
      name: string;
    };
  }
}

interface ITokenPayload {
  iat: number;
  exp: number;
  user_id: string;
  name: string;
}

function ensureAuthenticated(
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing!', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { user_id, name } = verify(token, configApp.secret) as ITokenPayload;

    request.user = {
      id: Number(user_id),
      name
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}

export default ensureAuthenticated;
