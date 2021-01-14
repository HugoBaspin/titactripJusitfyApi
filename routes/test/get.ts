// Dependencies
import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

function controller(req: Request, res: Response, next: NextFunction) {
  res.json({ text: "Hello World!" });
  return next();
}

router.get("/", controller);

module.exports = {
  router,
};

/**
 * @api {get} /test Test if server is responding
 * @apiVersion 0.1.0
 * @apiName TestServer
 * @apiGroup Test
 *
 * @apiDescription Check if the server is responsive
 *
 * @apiSuccessExample {Json} Success
 * {"text":"Hello World !"}
 */
