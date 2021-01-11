// Dependencies
import express from 'express';

const router = express.Router();

function controller(req: any, res: { json: (arg0: { text: string; }) => void; }, next: () => any) {
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
