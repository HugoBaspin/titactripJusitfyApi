// Dependencies
import express, { Request, Response, NextFunction } from "express";
import * as Db from "../../config/db";
import { generateCustomError, level } from "../../config/error";

const router = express.Router();

const controller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await Db._knex.raw("SELECT 42");
    res.json({ success: true, result: results });
    return next();
  } catch (exc) {
    return next(
      generateCustomError(
        level.ERROR,
        new Error("INTERNAL_SERVER_ERROR"),
        500,
        {
          exc,
          body: req.body,
          headers: req.headers,
        }
      )
    );
  }
};

router.get("/database", controller);

module.exports = {
  router,
};
/**
 * @api {get} /test/database Test database connectivity
 * @apiVersion 0.1.0
 * @apiName TestDatabase
 * @apiGroup Test
 *
 * @apiDescription Check if connectivity to PostgreSQL server databases is up
 *
 * @apiSuccessExample {Json} Success
 * {"text":"Hello World !"}
 *
 * @apiErrorExample {Json} Problem
 * {
 *     "error": "testException",
 *     "code": 500,
 *     "message": "INTERNAL_SERVER_ERROR",
 *     "type": "CUSTOM"
 * }
 */
