import { utc } from "moment";
import { logger } from "../config/logger";
import { Request, Response, NextFunction } from "express";

export function log(req: Request, res: Response, next: NextFunction) {
  const log: any = {
    time: utc().format(),
    method: req.method,
    path: req.path,
    code: res.statusCode,
  };
  logger().log("info", JSON.stringify(log));
  return next();
}
