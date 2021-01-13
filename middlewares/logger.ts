import { utc } from "moment";
import { dependencies } from "../config/dependencies";
import { Request, Response, NextFunction } from "express";

const logger = dependencies.getLogger();

export function log(req: Request, res: Response, next: NextFunction) {
  const log = {
    time: utc().format(),
    method: req.method,
    path: req.path,
    code: res.statusCode,
  };
  logger.log("info", JSON.stringify(log));
  return next();
}
