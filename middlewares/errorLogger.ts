import { utc } from "moment";
import { logger } from "../config/logger";
import { Request, Response, NextFunction } from "express";

export function errorLog(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const info: any = {
    time: utc().format(),
    method: req.method,
    path: req.path,
    code: err.statusCode || 500,
    error: err.message,
    stack: err.stack,
    additionalInfo: err.additionalInfo,
  };
  logger().log(err.level || "error", JSON.stringify(info));
  res.status(err.statusCode || 500).json(err);
  return next();
}
