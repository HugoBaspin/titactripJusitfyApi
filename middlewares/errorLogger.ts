/* eslint-disable no-param-reassign */
import { utc } from "moment";
import { dependencies } from "../config/dependencies";
import { Request, Response, NextFunction } from "express";

const logger = dependencies.getLogger();

export function errorLog(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const info = {
    time: utc().format(),
    method: req.method,
    path: req.path,
    code: err.statusCode || 500,
    error: err.message,
    stack: err.stack,
    additionalInfo: err.additionalInfo,
  };
  logger.log(err.level || "error", JSON.stringify(info));
  res.status(err.statusCode || 500).json(err);
  return next();
}
