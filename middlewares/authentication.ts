import * as Jwt from '../services/jwthelper';
import { Request, Response, NextFunction } from 'express';
import { generateCustomError, level } from '../config/error';

export = () => (req: Request, res: Response, next: NextFunction) => {
  res.locals.variables = res.locals.variables || [];
  if (!req.headers.authorization) {
    return next(generateCustomError(level.INFO, new Error('UNAUTHORIZED'), 401, {}));
  }

  const headerValue: string = req.headers.authorization;
  let token: string | null = null;
  let tokenParts: string[];
  let credentials: any;

  if (headerValue) {
    tokenParts = headerValue.split(' ');
    if (tokenParts) {
      token = tokenParts.length > 1 ? tokenParts[1] : null;
    }
  }
  if (token) {
    try {
      credentials = Jwt.verifyToken(token);
    } catch (e) {
      return next(generateCustomError(level.INFO, new Error('BAD_JWT'), 401));
    }
    if (!!credentials && !!credentials.userId) {
      res.locals.requestUserId = credentials.userId;
      return next();
    }
    return next(generateCustomError(level.INFO, new Error('BAD_JWT'), 401));
  }
  return next(generateCustomError(level.INFO, new Error('UNAUTHORIZED'), 401));
};
