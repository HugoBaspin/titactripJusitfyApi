import * as Jwt from "../lib/jwthelper";
import { Request, Response, NextFunction } from "express";
import { generateCustomError, level } from "../config/error";

module.exports = () => (req: Request, res: Response, next: NextFunction) => {
  res.locals.variables = res.locals.variables || [];
  if (!req.headers.authorization) {
    return next(
      generateCustomError(level.INFO, new Error("UNAUTHORIZED"), 401, {})
    );
  }
  const headerValue = req.headers.authorization;
  let token = null;
  if (headerValue) {
    const tokenParts = headerValue.split(" ");
    if (tokenParts) {
      token = tokenParts.length > 1 ? tokenParts[1] : null;
    }
  }
  if (token) {
    let credentials: any;
    try {
      credentials = Jwt.verifyToken(token);
    } catch (e) {
      return next(
        generateCustomError(level.INFO, new Error("UNAUTHORIZED"), 401)
      );
    }
    if (!!credentials && !!credentials.userId) {
      res.locals.variables.requestUserId = credentials.userId;
      return next();
    }
    return next(generateCustomError(level.INFO, new Error("BAD_JWT"), 401));
  }
  return next(generateCustomError(level.INFO, new Error("UNAUTHORIZED"), 401));
};
